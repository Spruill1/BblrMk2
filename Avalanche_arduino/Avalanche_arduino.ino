#define tubes 6
#define LED 22
#define TUBE 36

long tubeLengths[tubes];

void setup(){
    for(int i = 0; i < tubes; i++){
      pinMode(LED+i, OUTPUT);digitalWrite(LED+i, LOW);
      pinMode(TUBE+i,OUTPUT);digitalWrite(TUBE+i,LOW);
    }
}

void loop(){
  if(Serial.available()){
    byte recv = Serial.read();
    if(recv == 'A'){ //start the avalanche game
      avalanche();
    }
  }
}


#define ave_minBetween 350
#define ave_maxBetween 850
byte ave_score = 0;//maybe make an int?
long ave_lastFired[tubes];
long ave_inBubble[tubes];
long ave_betBubble[tubes];
int ave_refireChance;
byte ave_player;
void setupAvalanche(){
  randomSeed(analogRead(13)); //this should be a sufficiently random seed
  
  ave_player=0;  ave_score=0;  ave_refireChance = 20;
  for(int i = 0; i < tubes; i++){
    ave_lastFired[i]=millis();ave_inBubble[i]=-1;
    ave_betBubble[i]=random(ave_minBetween,ave_maxBetween);
  }
}

void avalanche(){
  setupAvalanche();
  while(1){
   if(Serial.available()){
    byte val_read = Serial.read();
    if(val_read==0x80) return;
    
    //the input was a new ave_player position
    for(int i = 0; i < tubes; i++){
       digitalWrite(LED+i,(val_read&0x01)>0?HIGH:LOW);
       val_read /= 2; //shift 
    }
    
    //check each QTI sensor for a bubble
    
    //issue a bubble in each tube if I should
    for(int i = 0; i < tubes; i++){
        if(ave_inBubble[i]>0 && 
        if(millis()-ave_lastFired[i] > tubeLengths[i]){
          if(random(1,101) < ave_refireChance){
            
          }
        }
    }
   } 
  }
  
}
