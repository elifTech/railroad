var deviceName = 'Railroad';
var keyID = 'a20f8fc35b';
var keyPath = './aws/certs/';
var awsRegion = 'us-west-2';

module.exports = {
  'device': deviceName,
  'aws-iot': {
     keyPath: keyPath + keyID + '-private.pem.key',
    certPath: keyPath + keyID + '-certificate.pem.crt',
      caPath: keyPath + 'rootCA.pem',
    clientId: deviceName,
      region: awsRegion
  },
  'state0': {
    train: {
      direction: true,
      speed: 0.0,
      light: false
    }
  },
  'train': 3501,
  'JMRI_IP': '192.168.0.70'
}
