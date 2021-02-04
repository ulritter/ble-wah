/*
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
*/ 
let BT_connected = false
let pedalOn = true
let pedalChanged = false
// toggleModulationEffect needs to correspond to the midi settings e.g. in 
// JamUp Pro which defines the control change setting for the Toggle Modulation setting
let toggleModulationEffect = 24

bluetooth.onBluetoothConnected(function () {
    BT_connected = true
})
bluetooth.onBluetoothDisconnected(function () {
    BT_connected = false
})
let cc_out = 0
let cc_out_old = 8
let cc_full = 127
let channel = 4
// wah_midi_control needs to correspond to the midi settings e.g. in 
// JamUp Pro which defines the control change setting for the wah pedal
let wah_midi_control = 4
let tilt = 0
let low_tilt = 0
let max_tilt = 1024
let high_tilt = 683 // == fraction of total tilt

// "A" button toggles pauses / unpauses pedal movement 
// (would need to go on a pin if used with a physical pedal)
input.onButtonPressed(Button.A, function () {
    pedalOn = !pedalOn
    pedalChanged = true 
})

// "B" button toggles modulation device power within JamUp Pro app 
// (would need to go on a pin if used with a physical pedal)
input.onButtonPressed(Button.B, function () {
    midi.channel(channel).controlChange(toggleModulationEffect, cc_full)
})

// main loop
basic.forever(function () {
    // Only do anything when connected to Bluetooth
    if (BT_connected){
        if (!pedalOn && pedalChanged) {
            basic.showString("P")
            pedalChanged = false
        }
        while (pedalOn) {      
            tilt = input.acceleration(Dimension.Y)
            // Only do something if tilting to one side
            if (tilt < 0) tilt = 0
            // basic.pause(20)
            // We only do something inbetween a certain angle 
            // Then inversely map the value to a number space between 0 and 127 because
            // 0 = pedal up, 127 = pedal down
            if (tilt >= low_tilt && tilt <= high_tilt ) {
                cc_out=(cc_full-(tilt/max_tilt*cc_full))
            }
            // get rid of timing effects if we tilt the micro:bit too fast
            if (tilt < low_tilt) {
                cc_out = 127
            }
            if (tilt > high_tilt) {
                cc_out = 0
            }
            // Only send control change in case of tilt change
            if (Math.abs(cc_out - cc_out_old) > 2) {
                // show intensitiy on LED grid
                led.plotBarGraph(cc_out, 0)
                // send new value
                midi.channel(channel).controlChange(wah_midi_control, cc_out)
                cc_out_old = cc_out
            }
        }
    } else {
        basic.showString("-")
    }
})
