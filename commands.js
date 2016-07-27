module.exports = {
  'set_address': '{"type":"throttle","data":{"throttle":"%ID%","address":%ID%}}',
  'power': '{"type":"power","data":{}}',
  'ping': '{"type":"ping"}',
  'direction': '{"type":"throttle","data":{"throttle":"%ID%","forward":"%DIRECTION%"}}',
  'speed': '{"type":"throttle","data":{"throttle":"%ID%","speed":"%SPEED%"}}',
  'emergency_stop': '{"type":"throttle","data":{"throttle":"%ID%","speed":-1.0}}'
}
