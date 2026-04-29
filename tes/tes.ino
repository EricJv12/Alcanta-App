#include <Arduino.h>
#include <WiFiS3.h>
#include <Arduino_JSON.h>
#include <ArduinoHttpClient.h>
#include "wifi_config.h"

#define PH_SENSOR A1  //Defines ph sensor pin.
#define WF_SENSOR 2   //Defines water flow sensor pin.
#define WL_SENSOR 3   //Defines water level sensor pin.

//Water level sensor (floater) variables
int buttonState = 1;  //reads pushButton Status for water level sensor.
String wLevel = "Function not updating variable";

//Sets sample size for gathering multiple readings.
int sampleSize = 10;

//PH sensor variables
unsigned long int avgVal;  // Holds the average value of pH samples
int arrBuff[10];           //Array to hold samples
float phVal;               //  pH value
String phValueStr;         //String of phValue
float offsetpH = 0.55;     //Calibration variable 21.58

//Water Flow sensor variables
volatile int count;  // Counts the number of pulses. Needs to be volatile to ensure it updates correctly during the interrupt.
double flowRate;     // Stores the flow rate.

//Alarm variables
bool alarm = false;
//Time interval variable in milliseconds
int timeInterval = 30000;  //30,000 = 30 seconds; 300,000 = 5 minutes

  //WiFi variables
  char wifiN[] = WIFI_NAME;   //Network Name
char pass[] = WIFI_PASS;      // network password
int status = WL_IDLE_STATUS;  // the WiFi radio's status

//Http Client
char serverAdd[] = SERV_ADD;
int port = PORT;

char* device_name = "Arduino-A1-Caguas";
int device_id;

WiFiClient wifi;
HttpClient hClient = HttpClient(wifi, serverAdd, port);

//Transmit variables
String appUrl = APPURL;
String getUrl = appUrl + "/device/byName/";
String postUrl = appUrl + "/measurement/addEntry";
String postAlarm = appUrl + "/alarm/addEntry";

//const unsigned long timeInterval = 5000; // Constant time interval in milliseconds; 1000 = 1 second.

void setup() {
  // put your setup code here, to run once:

  Serial.begin(9600);

  /* Pre-Checks for WiFi connections
  * Check for the WiFi module:
  */
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true)
      ;
  }
  //Check if firmware version is up to date.
  String firm = WiFi.firmwareVersion();
  if (firm < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
  }

  //Connect to Wifi
  connWifi();
  //Display wifi
  Serial.println("Connection succesfull");
  showWifi();  //-neg values = good

  // print your WiFi shield's IP address: For debugging purposes
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);


  pinMode(WL_SENSOR, INPUT_PULLUP);                                      //Sets pin 3 (water level sensor) to input mode with internal resistor functionality.
  pinMode(WF_SENSOR, INPUT);                                             //Sets pin 2 (water flow sensor) to input mode
  attachInterrupt(digitalPinToInterrupt(WF_SENSOR), countFlow, RISING);  //Configures interrupt (pin 2 on the Arduino Uno) to run the function "countFlow" on RISING.

  //Enables interrupts on the Arduino
  interrupts();

  Serial.println("Time interval to gather data and transmit: 30seconds or ");
  Serial.print(timeInterval);
  Serial.println(" milliseconds.");
  Serial.println("Ready");
}


void loop() {
  // put your main code here, to run repeatedly:
  readpH();
  readwLevel();
  readFlow();
  wifiStatus();
  transmitData();

  delay(timeInterval);
}

//Function to read pH sensor data.
void readpH() {
  float avgVal = 0;
  for (int i = 0; i < sampleSize; i++) {
    arrBuff[i] = analogRead(PH_SENSOR);
    delay(10);
  }
  for (int c = 0; c < sampleSize; c++)
    avgVal += arrBuff[c];

  phVal = avgVal * 5.0 / 1024 / 10;
  phVal = 3.5 * phVal + offsetpH;
  /* Only used for testing Sensor
  Serial.print("pH:");
  Serial.print(phVal);
  Serial.println(" ");
  */
}

//Function reads water level sensor and display data.
void readwLevel() {

  buttonState = digitalRead(WL_SENSOR);
  if (buttonState == LOW) {
    wLevel = "High";
    //  Serial.println("Water level - High \n");  //Used for testing purposes.
  } else {
    wLevel = "Low";
    //  Serial.println("Water level - Low \n");   //Used for testing purposes.
  }
}

// Reads water flow sensor data.
void readFlow() {
  int totalCount = 0;  //Initialize a new variable to store total amount of count(pulses) during a short amount of time.
  count = 0;           //Reset count to 0.

  for (int i = 0; i < sampleSize; i++) {
    delay(100);
    totalCount += count;
  }

  //  noInterrupts(); //Disable the interrupts on the Arduino.

  int avgCount = totalCount / sampleSize;

  //Conversion from seconds to minutes/ to mL to Liters.
  flowRate = (count * 2.25);   //Take counted pulses in the last second and multiply by 2.25mL
  flowRate = flowRate * 60;    //Convert seconds to minutes, giving you mL / Minute
  flowRate = flowRate / 1000;  //Convert mL to Liters, giving you Liters / Minute
  /*
  Only used for testing Sensor
  Serial.print("Flow Rate: ");
  Serial.print(flowRate);         //Print the variable flowRate to Serial
  Serial.print(" L/min \n");
  */
}

//Function is called every time the flow sensor pulses incrementing the count variable.
void countFlow() {
  count++;
}

//Function to connect Arduino to wifi network.
void connWifi() {

  // Connect to WiFi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to WiFi network: ");
    Serial.println(wifiN);
    // Connect to WPA/WPA2 network:
    status = WiFi.begin(wifiN, pass);

    // wait 15 seconds for connection.
    delay(15000);
  }
}
//Show wifi status on serial monitor
void wifiStatus() {
  int wStatus = WiFi.status();
  switch (wStatus) {
    case WL_CONNECTED:
      {
        Serial.print("Connected to WiFi: ");
        Serial.println(WiFi.SSID());
      }
      break;
    case WL_CONNECTION_LOST:
      {
        Serial.println("Connection Lost");
        connWifi();
      }
      break;
    case WL_IDLE_STATUS:
      {
        Serial.println("Attempting to connect: " + String(wStatus));
      }
      break;
    case WL_CONNECT_FAILED:
      {
        Serial.println("Connection Failed: " + String(wStatus));
        connWifi();
      }
      break;
    case WL_DISCONNECTED:
      {
        Serial.println("You are disconnected from the WiFi Network");
      }
      break;
  }
}

//Display wiFi data.
void showWifi() {
  //Display wifi name
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());
  //Show signal Strength
  long rssi = WiFi.RSSI();
  Serial.print("Signal strength: ");
  Serial.println(rssi);
}

void transmitData() {
  JSONVar jData;
  JSONVar jAlarm;
  String id;
  String jString;
  String contentType = "application/json";

  //Convers phVal to string and rounds it to 2 decimal places. Because the JSON library preserves the full precision of the floating point value.
  phValueStr = String(phVal, 2);

  //Get device id
  getUrl += device_name;
  hClient.get(getUrl);
  int statusCode = hClient.responseStatusCode();
  if (statusCode == 200) {
    id = hClient.responseBody();
    device_id = id.toInt();
  } else {
    Serial.print("Error getting device id, status code: ");
    Serial.println(statusCode);
  }
  jData["ph"] = phValueStr;
  jData["wlevel"] = wLevel;
  jData["wflow"] = flowRate;
  jData["id"] = device_id;

  Serial.println("Making POST Request");


  jString = JSON.stringify(jData);

  //Post
  hClient.post(postUrl, contentType, jString);

  // read the status code and body of the response
  statusCode = hClient.responseStatusCode();
  String response = hClient.responseBody();
  JSONVar res = JSON.parse(response);

  Serial.print("Status code: ");
  Serial.println(statusCode);
  Serial.print("Response: ");
  Serial.println(response);
  //Get measurement post id for alarm post
  int mesId = res["id"];

  alarmData();  //Check arameters for creating alarm
  if (alarm != false) {
    Serial.print("Measurement ID: ");
    Serial.println(mesId);

    jAlarm["status"] = "unresolved";
    jAlarm["id"] = mesId;

    jString = JSON.stringify(jAlarm);

    hClient.post(postAlarm, contentType, jString);
    statusCode = hClient.responseStatusCode();
    String response = hClient.responseBody();

    Serial.print("Alarm-Status code: ");
    Serial.println(statusCode);
    Serial.print("Alarm-Response: ");
    Serial.println(response);
  }

  hClient.stop();
}

void alarmData() {
  if (wLevel == "High" || flowRate < 2 || phVal < 6.5 || phVal > 10)
    alarm = true;
  else
    alarm = false;
}
