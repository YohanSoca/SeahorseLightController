import json
from os import truncate
from django.shortcuts import render
from django.http import HttpResponse
from django.urls.conf import path
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse


import minimalmodbus
import serial
import time
import threading


class Interface:
    def __init__(self):
        self.lights_status = [0 for _ in range(4)]
        self.lights_cached = [0 for _ in range(4)]
        self.module_name = 'Looking for IO device'
        self.connected = False
        self.io_module_ready = False
        self.serial_line_ready = False
        threading.Thread(target=self.init_ser).start()
 
    def find_module_name(self):
        try:
            self.module_name = self.ser.read_register(102)
        except:
            pass            
    
    def init_ser(self):
        while not self.connected:
            try:
                for parity in [serial.PARITY_NONE, serial.PARITY_EVEN, serial.PARITY_ODD]:
                    for baudrate in [9600, 19200, 38400]:
                        for mod_id in range(1, 20):
                            self.ser = minimalmodbus.Instrument('COM11', mod_id)
                            self.ser.serial.baudrate = baudrate        # Baud
                            self.ser.serial.bytesize = 8
                            self.ser.serial.parity   = parity
                            self.ser.serial.stopbits = 1
                            self.ser.serial.timeout  = 0.05         
                            self.ser.mode = minimalmodbus.MODE_RTU   # rtu or ascii mode
                            self.ser.clear_buffers_before_each_transaction = True
                            for reg in range(0, 2):
                                try:
                                    print(f"ID: {mod_id}, baudrate: {baudrate}, Register: {reg}, Parity: {parity}")
                                    self.ser.read_bit(reg)
                                    self.connected = True
                                    threading.Thread(target=self.find_module_name).start()
                                    print(f"Connected")
                                    return
                                except:
                                    pass                               

                
            except:
                print('trying to connect')  
                time.sleep(1)  

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
            self.io_module_ready = True  
            return val
        except:
            pass   
             

    
light_interface = Interface()

def index(request):
    global light_interface

    if light_interface.connected:
        return render(request, 'controller_ui/home.html')
    else:
        return render(request, 'controller_ui/setup_page.html')

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

@csrf_exempt
def get_system_state(request):
    global light_interface

    status = {'serial_line_ready': str(light_interface.module_name), 'io_module_ready': '0'}
    

    return JsonResponse(status)   