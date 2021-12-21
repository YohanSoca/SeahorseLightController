import json
from django.shortcuts import render
from django.http import HttpResponse
from django.urls.conf import path
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

import minimalmodbus
import serial


class Interface:
    def __init__(self):
        self.lights_status = [0 for _ in range(4)]
        self.lights_cached = [0 for _ in range(4)]
        self.connected = False
        self.init_ser()
        
    def init_ser(self):
        while not self.connected:
            try:
                self.ser = minimalmodbus.Instrument('COM5', 3)
                self.ser.serial.baudrate = 38400         # Baud
                self.ser.serial.bytesize = 8
                self.ser.serial.parity   = serial.PARITY_NONE
                self.ser.serial.stopbits = 1
                self.ser.serial.timeout  = 0.05         
                self.ser.mode = minimalmodbus.MODE_RTU   # rtu or ascii mode
                self.ser.clear_buffers_before_each_transaction = True

                self.connected = True
            except:
                print('trying to connect')    

    def change_light_status(self, light, status):
        light = int(light)
        status = int(status)
        try:
            if status == 1 and  self.lights_status[light] == 1:
                return
            if status == 0 and  self.lights_status[light] == 0:
                return

            if status == 0 and self.lights_cached[light] == 0 and self.lights_status[light] == 1:
                self.ser.write_bit(light, 1)
                self.lights_cached[light] = 1
                return
            if status == 0 and self.lights_cached[light] == 1 and self.lights_status[light] == 1:
                self.ser.write_bit(light, 0)
                self.lights_cached[light] = 0
                return 

            if status == 1 and self.lights_cached[light] == 1 and self.lights_status[light] == 0:
                print('logic direct')
                self.ser.write_bit(light, 0)
                self.lights_cached[light] = 0
                return
            if status == 1 and  self.lights_cached[light] == 0 and self.lights_status[light] == 1:
                print('logic reverse')
                self.ser.write_bit(light, 1)
                self.lights_cached[light] = 1
                return    
            self.ser.write_bit(light, status)
            self.lights_cached[light] = status    
               
            
        except:
            pass 
    
    def get_light_status(self):
        lights = []
        
        try: 
            val = self.ser.read_bits(0, 4)
            self.lights_status = val
            return val
        except:
            pass   
             

    
light_interface = Interface()

def index(request):
    global light_interface

   
    return render(request, 'controller_ui/home.html')

def about(request):
    global light_interface

    
    return render(request, 'controller_ui/zones.html')    

@csrf_exempt
def change_light_state(request):
    global light_interface

    if request.method == 'POST':
        data = json.loads(request.body)
        light = data['light']
        status = data['status']
        
        light_interface.change_light_status(data['light'], data['status'])
          
    return JsonResponse({'request': 'succes'})

@csrf_exempt
def get_lights_state(request):
    global light_interface

    status = light_interface.get_light_status()
    

    return JsonResponse({'lightStatus': status})