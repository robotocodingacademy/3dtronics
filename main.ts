
enum ToneHzTable {
    do = 262,
    re = 294,
    mi = 330,
    fa = 349,
    sol = 392,
    la = 440,
    si = 494
}

enum BeatList {
    //% block="1"
    whole_beat = 10,
    //% block="1/2"
    half_beat = 11,
    //% block="1/4"
    quarter_beat = 12,
    //% block="1/8"
    eighth_beat = 13,
    //% block="2"
    double_beat = 14,
    //% block="4"
    breve_beat = 15
}

enum Patrol{
    //% block="□□"
    white_white = 1,
    //% block="□■"
    white_black = 2,
    //% block="■□"
    black_white = 3,
    //% block="■■"
    black_black = 4
}

enum PingUnit {
    //% block="cm"
    Centimeters,
    //% block="μs"
    MicroSeconds
}

enum IRList {
    //% block="前方"
    front = 1,
    //% block="左侧"
    right = 2,
    //% block="右侧"
    left = 3
}

enum RgbList {
    //% block="全部"
    rgb = 9,
    //% block="灯1"
    rgb1 = 0,
    //% block="灯2"
    rgb2 = 1,
    //% block="灯3"
    rgb3 = 2,
    //% block="灯4"
    rgb4 = 3,
    //% block="灯5"
    rgb5 = 4,
    //% block="灯6"
    rgb6 = 5,
    //% block="灯7"
    rgb7 = 6,
    //% block="灯8"
    rgb8 = 7,
    //% block="灯9"
    rgb9 = 8
}

enum ColorList {
    //% block="红"
    red = 1,
    //% block="橙"
    orange = 2,
    //% block="黄"
    yellow = 3,
    //% block="绿"
    green = 4,
    //% block="蓝"
    blue = 5,
    //% block="靛"
    indigo = 6,
    //% block="浅紫"
    violet = 7,
    //% block="深紫"
    purple = 8,
    //% block="白"
    white = 9,
    //% block="黑"
    black = 1
}
enum PinList {
    //% block="上"
    up_pull = 1,
    //% block="下"
    down_pull = 2,
    //% block="无"
    no_pull = 3
}

//% weight=99 icon="\uf0e7" color=#1B80C4
namespace CruiseBit {

    let neoStrip = neopixel.create(DigitalPin.P1, 9, NeoPixelMode.RGB);

    /**
     * 设置电机
     */
    //% blockId="cruise_motor" block="电机 左 速度%leftSpeed| 右 速度%rightSpeed| 时长%time 秒"
    //% leftSpeed.min=-1023 leftSpeed.max=1023
    //% rightSpeed.min=-1023 rightSpeed.max=1023
    //% weight=100
    export function motorRun(leftSpeed: number, rightSpeed: number, time: number): void {
        let leftRotation = 1;
        if(leftSpeed < 0){
            leftRotation = 0;
        }

        let rightRotation = 1;
        if(rightSpeed < 0){
            rightRotation = 0;
        }
        
       //左电机 M1
        pins.analogWritePin(AnalogPin.P14, Math.abs(leftSpeed));
        pins.digitalWritePin(DigitalPin.P13, leftRotation);

        //右电机 M2
        pins.analogWritePin(AnalogPin.P16, Math.abs(rightSpeed));
        pins.digitalWritePin(DigitalPin.P15, rightRotation);

        //添加时间控制
        if(time < 0){
            time = 0;
        }
        
        let time_num = time*1000000;

        control.waitMicros(time_num);

        //左电机 M1
        pins.analogWritePin(AnalogPin.P14, 0);
        pins.digitalWritePin(DigitalPin.P13, 0);
        //右电机 M2
        pins.analogWritePin(AnalogPin.P16, 0);
        pins.digitalWritePin(DigitalPin.P15, 0);
        
        
    }

    /**
     * 播放音调
     */
    //% weight=89
    //% blockId="cruise_tone" block="播放音调 %tone| ，节拍 %beatInfo"
    export function myPlayTone(tone:ToneHzTable, beatInfo:BeatList): void {

        if(beatInfo == BeatList.whole_beat){
            music.playTone(tone, music.beat(BeatFraction.Whole));

        }
       
        if(beatInfo == BeatList.half_beat){
            music.playTone(tone, music.beat(BeatFraction.Half));

        }
        
        if(beatInfo == BeatList.quarter_beat){
            music.playTone(tone, music.beat(BeatFraction.Quarter));

        }

        if(beatInfo == BeatList.double_beat){
            music.playTone(tone, music.beat(BeatFraction.Double));

        }

        
        if(beatInfo == BeatList.eighth_beat){
            music.playTone(tone, music.beat(BeatFraction.Eighth));

        }

        if(beatInfo == BeatList.breve_beat){
            music.playTone(tone, music.beat(BeatFraction.Breve));

        }
        //1、16不行
        // if(beatInfo == BeatList.sixteen_beat){
        //     music.playTone(tone, music.beat(BeatFraction.SixTeenth));

        // }    
    }

    //% weight=79
    //% blockId="cruise_patrol" block="巡线传感器 %patrol"
    export function readPatrol(patrol:Patrol): boolean {

        // let p1 = pins.digitalReadPin(DigitalPin.P12);
        // let p2 = pins.digitalReadPin(DigitalPin.P11);

        if(patrol == Patrol.white_white){
            if(pins.digitalReadPin(DigitalPin.P12) == 1 && pins.digitalReadPin(DigitalPin.P11) == 1){
                return true;
            }else{
                return false;
            }
        }else if(patrol == Patrol.white_black){
            if(pins.digitalReadPin(DigitalPin.P12) == 1 && pins.digitalReadPin(DigitalPin.P11) == 0){
                return true;
            }else{
                return false;
            }
        }else if(patrol == Patrol.black_white){
            if(pins.digitalReadPin(DigitalPin.P12) == 0 && pins.digitalReadPin(DigitalPin.P11) == 1){
                return true;
            }else{
                return false;
            }
        }else if(patrol == Patrol.black_black){
            if(pins.digitalReadPin(DigitalPin.P12) == 0 && pins.digitalReadPin(DigitalPin.P11) == 0){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    //% blockId=cruise_sensor block="超声波探测距离 %unit"
    //% weight=69
    export function sensorDistance(unit: PingUnit, maxCmDistance = 500): number {
        // send pulse
        //pins.setPull(DigitalPin.P2, PinPullMode.PullNone);
        //pins.setPull(DigitalPin.P2, PinPullMode.PullUp);
        //pins.setPull(DigitalPin.P5, PinPullMode.PullUp);

        //pins.digitalWritePin(DigitalPin.P2, 0);
        //control.waitMicros(4);
        //pins.digitalWritePin(DigitalPin.P2, 1);
        //control.waitMicros(10);
        //pins.digitalWritePin(DigitalPin.P2, 0);
        
        // read pulse
        //let d = pins.pulseIn(DigitalPin.P5, PulseValue.High, maxCmDistance * 58);
        //console.log("Distance: " + d/58);
        
        //basic.pause(50)

        //switch (unit) {
            //case PingUnit.Centimeters: return d / 58;
            //default: return d ;
        //}

         // send pulse
         pins.setPull(DigitalPin.P2, PinPullMode.PullNone);
         pins.digitalWritePin(DigitalPin.P2, 0);
         control.waitMicros(2);
         pins.digitalWritePin(DigitalPin.P2, 1);
         control.waitMicros(10);
         pins.digitalWritePin(DigitalPin.P2, 0);
 
         // read pulse
         const d = pins.pulseIn(DigitalPin.P2, PulseValue.High, maxCmDistance * 58);
 
         switch (unit) {
             case PingUnit.Centimeters: return Math.idiv(d, 58);
             default: return d ;
 }
    }


    /**
      * 红外线探测左、前、右是否有障碍物
      */
    //% blockId="cruise_IR" block="%IRDire| 有障碍物"
    //% weight=68
    export function cruiseIR(IRDire:IRList): boolean {
        if(IRDire == IRList.front){
            if(pins.digitalReadPin(DigitalPin.P5) == 0){
                return true;
            }else{
                return false;
            }
        }else if(IRDire == IRList.left){
            if(pins.digitalReadPin(DigitalPin.P8) == 0){
                return true;
            }else{
                return false;
            }
        }else if(IRDire == IRList.right){
            if(pins.digitalReadPin(DigitalPin.P2) == 0){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    //% blockId=cruise_rgb block="设置板载LED %RgbValue| 颜色为 %ColorValue"
    //% weight=59
    export function setRGB(RgbValue: RgbList, ColorValue:ColorList): void {
        
        if(ColorValue == ColorList.red){
            if(RgbValue == RgbList.rgb){
                neoStrip.showColor(neopixel.colors(NeoPixelColors.Red));
            }else{
                neoStrip.setPixelColor(RgbValue, neopixel.colors(NeoPixelColors.Red));
            }
            
        }
        
        if(ColorValue == ColorList.orange){
            if(RgbValue == RgbList.rgb){
                neoStrip.showColor(neopixel.colors(NeoPixelColors.Orange));
            }else{
                neoStrip.setPixelColor(RgbValue, neopixel.colors(NeoPixelColors.Orange));
            }
        }
        
        if(ColorValue == ColorList.yellow){
            if(RgbValue == RgbList.rgb){
                neoStrip.showColor(neopixel.colors(NeoPixelColors.Yellow));
            }else{
                neoStrip.setPixelColor(RgbValue, neopixel.colors(NeoPixelColors.Yellow));
            }
        }
        
        if(ColorValue == ColorList.green){
            if(RgbValue == RgbList.rgb){
                neoStrip.showColor(neopixel.colors(NeoPixelColors.Green));
            }else{
                neoStrip.setPixelColor(RgbValue, neopixel.colors(NeoPixelColors.Green));
            }
        }
        
        if(ColorValue == ColorList.blue){
            if(RgbValue == RgbList.rgb){
                neoStrip.showColor(neopixel.colors(NeoPixelColors.Blue));
            }else{
                neoStrip.setPixelColor(RgbValue, neopixel.colors(NeoPixelColors.Blue));
            }
        }
        
        if(ColorValue == ColorList.indigo){
            if(RgbValue == RgbList.rgb){
                neoStrip.showColor(neopixel.colors(NeoPixelColors.Indigo));
            }else{
                neoStrip.setPixelColor(RgbValue, neopixel.colors(NeoPixelColors.Indigo));
            }
        }
        
        if(ColorValue == ColorList.violet){
            if(RgbValue == RgbList.rgb){
                neoStrip.showColor(neopixel.colors(NeoPixelColors.Violet));
            }else{
                neoStrip.setPixelColor(RgbValue, neopixel.colors(NeoPixelColors.Violet));
            }
        }
        
        if(ColorValue == ColorList.purple){
            if(RgbValue == RgbList.rgb){
                neoStrip.showColor(neopixel.colors(NeoPixelColors.Purple));
            }else{
                neoStrip.setPixelColor(RgbValue, neopixel.colors(NeoPixelColors.Purple));
            }
        }
        
        if(ColorValue == ColorList.white){
            if(RgbValue == RgbList.rgb){
                neoStrip.showColor(neopixel.colors(NeoPixelColors.White));
            }else{
                neoStrip.setPixelColor(RgbValue, neopixel.colors(NeoPixelColors.White));
            }
        }
        
        if(ColorValue == ColorList.black){
            if(RgbValue == RgbList.rgb){
                neoStrip.showColor(neopixel.colors(NeoPixelColors.Black));
            }else{
                neoStrip.setPixelColor(RgbValue, neopixel.colors(NeoPixelColors.Black));
            }
        }

        neoStrip.show();
        
    }

   /**
     * Clear leds.
     */
   //% blockId="cruise_neo_clear" block="关闭所有LED灯"
   //% weight=55
   export function neoClear(): void {
       neoStrip.showColor(neopixel.colors(NeoPixelColors.Black));
   }

    /**
      * Shows a rainbow pattern on all LEDs.
      */
    //% blockId="cruise_neo_rainbow" block="彩虹灯"
    //% weight=56
    export function neoRainbow(): void {
        neoStrip.showRainbow(1, 360);
    }

     //% blockId=tape_rgb block="设置拉 引脚 %pin| 为 %way"
    //% weight=49
    export function setTapeLights(pin: DigitalPin, way: PinList): void {

        if(way = PinList.up_pull){
            pins.setPull(pin, PinPullMode.PullUp);
        }else if(way = PinList.down_pull){
            pins.setPull(pin, PinPullMode.PullDown);
        }else{
            pins.setPull(pin, PinPullMode.PullNone);
        }

        
        
}

}
