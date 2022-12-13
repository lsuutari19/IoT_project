//
//    FILE: DHT20_test_esp.ino
//  AUTHOR: Rob Tillaart
// PURPOSE: Demo for DHT20 I2C humidity & temperature sensor
//

//  Always check datasheet - front view
//
//          +--------------+
//  VDD ----| 1            |
//  SDA ----| 2    DHT20   |
//  GND ----| 3            |
//  SCL ----| 4            |
//          +--------------+

#include "DHT20.h"

DHT20 DHT(&Wire);


void setup()
{
  
#if defined(ESP8266) || defined(ESP32)
  DHT.begin(12, 13);  //  select your pin numbers here
#else
  DHT.begin();
#endif

  Serial.begin(115200);
  delay(2000);

}


void loop()
{
  //  READ DATA

  int status = DHT.read();


  //  DISPLAY DATA, sensor has only one decimal.
  Serial.print(DHT.getHumidity(), 1);
  Serial.print('%');
  Serial.print(",\t");
  Serial.print(DHT.getTemperature(), 1);
  Serial.println("°C");
  delay(2000);
}


// -- END OF FILE --
