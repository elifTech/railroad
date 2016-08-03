from __future__ import print_function

import boto3
import json
import re
import operator

from base64 import b64decode
from urlparse import parse_qs


def lambda_handler(event, context):
    '''Provide an event that contains the following keys:

      - text: input text in natural language to be transformed into command
    '''

    print("Received event: " + json.dumps(event, indent=2))

    if len(event) == 0:
        import time
        sec_before = 300
        start = (int(time.time()) - sec_before) * 1000
        logClient = boto3.client('logs')
        response = logClient.filter_log_events(
            logGroupName='/aws/lambda/textToCommand',
            startTime=start
            )
        response = response['events']
        response = [v for v in response if re.match(r'.*winner.*', v['message'])]
        return response


    if 'body' in event:
        event = parse_qs(event['body'])
        event['text'] = str(event['text'][0])

    if 'name' in event:
        print ('our winner is %s' % event['name'])

    print(event["text"])
    res = parse(event["text"])

    if res["command"] != "unknown":
        print(
            "Transfering command \"" +
            res["command"] +
            "\" to" + res["subject"] + "controller"
            )

        client = boto3.client("iot-data")
        client.publish(
            topic="controller/post",
            qos=0,
            payload=json.dumps({"state": {"desired": res}})
        )
        res.update({"status": "OK"})

        return res
    else:
        print("Can't parse \"" + event["text"] + "\" to any known command.")
        res.update({"status": "UNKNOWN_COMMAND"})
        return res

# ------------------ CONSTANTS
commands = {
    "train": {
        "move": {
            "sub": {
                "forward":
                    ["forward", "front", "onward", "head",
                        "ahead", "advance", "hasten"],
                "backward": ["backward", "backwards", "back", "reverse"]
            },
            "kw":
                ["move", "go", "head", "travel",
                    "push", "charge", "run", "drive",
                    "advance", "propel", "lead"]
        },
        "lights": {
            "sub": {
                "on": ["on", "up", "ignite"],
                "off": ["off", "down", "put"]
            },
            "kw":
                ["lights", "light", "lamp", "lantern",
                    "flare", "torch", "shine", "sparkle"]
        },
        "speed": {
            "sub": {
                "up": ["up", "increase", "speed", "accelerate", "put on"],
                "down": ["down", "slow", "decrease", ]
            },
            "kw": ["speed", "movement"]
        },
        "stop": ["stop", "halt", "terminate", "deactivate", "finish", "end"],
        "start": ["start", "begin", "activate", "started", "launch"]
    },
    "stub": {
        "right": ["right"],
        "left": ["left"]
    }
}


subjects = {
    "train": ["train", "locomotive"],
    "stub": ["stub", "switch", "arrow"]
}

commands_all = {}

for subj in subjects:
    commands_all.update(commands[subj])


# ------------------ Parse function
def parse(text):
    subject = t2s(text)

    if subject != "unknown":
        command = t2c(text, commands[subject])
    else:
        command = t2c(text, commands_all)
        for subj in subjects:
            if command.split("_")[0] in commands[subj]:
                subject = subj
                break

    return {"subject": subject, "command": command}


def t2s(text, subjects=subjects):
    dct = predict(text, subjects, base=subjects)
    if sum(dct.values()) > 0:
        return max(dct.iteritems(), key=operator.itemgetter(1))[0]
    else:
        return 'unknown'


def t2c(text, commands=commands_all):
    dct = predict(text, commands)
    if sum(dct.values()) > 0:
        return max(dct.iteritems(), key=operator.itemgetter(1))[0]
    else:
        return 'unknown'


def get_keywords(command, base=commands_all):
    levels = command.strip().split(' ')

    current = base
    kw = []

    for k in levels:
        cmd = current[k]
        if type(cmd) is list:
            kw.extend(cmd)
        else:
            kw.extend(cmd["kw"])
            current = cmd["sub"]

    return kw


def compare(text, kw):
    c = 0

    for word in kw:
        if re.match("(^|(.* ))" + word + "(( .*)|$)", text, re.I):
            c += 1
    return c


def predict(text, cmds=commands_all, head='', base=commands_all):
    dct = {}
    print(cmds)
    for cmd in cmds:
        print(cmds[cmd])
        if type(cmds[cmd]) is list:
            grade = compare(text, get_keywords(head + " " + cmd, base))
            dct[(head + "_" + cmd).strip().strip("_")] = grade
        else:
            dct.update(predict(text, cmds[cmd]["sub"], head + " " + cmd))

    return dct
