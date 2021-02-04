# ble-wah
Thanks to BEATNVISION in his video: https://www.youtube.com/watch?v=ucwRu_jafwI  
I got the idea to give it a shot and try to re-implement a virtual wah pedal
based on the BBC micro:bit platform together with Positivegrid's fabulous JamUp Pro
app on an iPad

These are the steps how I got it to work:
- pair the micro:bit with the iOS device using the micro:bit app
- in Makecode load the Bluetooth and MIDI over Bluetooth extensions
- download the code below to the micro:bit
- in JamUp Pro -> settings -> midi setting: enable midi control
- in JamUp Pro -> settings -> midi setting: midi channel set to "all channel"
- in JamUp Pro -> settings -> midi setting: Midi Control Assignments: add new control assignment, 
  set "Change the cry-wah effect depth" to CC4 ( your choice, just make sure the "wah_midi_control" variable below is a match)
- in iOS settings -> Bluetooth: connect to BBC micro:bit
- set Garage Band -> Settings -> Advanced -> "Run in Background" to on
- in Garage Band -> Settings -> Advanced -> Bluetooth MIDI Devices: you should see your "BBC micro:bit" as device. 
  If not connected tap on it to connect
- switch to JamUp Pro, now you should be able to control the "Cry Baby" effect with the micro:bit

We control the virtual wah pedal by tilting the micro:bit over the X-Axis
Tilting over the x-axis /button to button) will get us X values between -1023 and +1023
which corresponds to angles between -90° and +90°
We use Math.abs() to get rid of negative values so the micro:bit can be tilted from 
either side and Math.round() to make sure we get plain integer values
