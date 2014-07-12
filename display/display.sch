EESchema Schematic File Version 2
LIBS:ugl
LIBS:power
LIBS:device
LIBS:transistors
LIBS:conn
LIBS:linear
LIBS:regul
LIBS:74xx
LIBS:cmos4000
LIBS:adc-dac
LIBS:memory
LIBS:xilinx
LIBS:special
LIBS:microcontrollers
LIBS:dsp
LIBS:microchip
LIBS:analog_switches
LIBS:motorola
LIBS:texas
LIBS:intel
LIBS:audio
LIBS:interface
LIBS:digital-audio
LIBS:philips
LIBS:display
LIBS:cypress
LIBS:siliconi
LIBS:opto
LIBS:atmel
LIBS:contrib
LIBS:valves
LIBS:opendous
LIBS:display-cache
EELAYER 24 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title "Ultimate Hacking Keyboard - LED Display Board"
Date "7 mar 2013"
Rev "3"
Comp "Ultimate Gadget Laboratories Kft."
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
Text Label 4800 2650 0    40   ~ 0
ROW1
Text Label 4800 2750 0    40   ~ 0
ROW2
Text Label 4800 2850 0    40   ~ 0
ROW3
Text Label 4800 2950 0    40   ~ 0
ROW6
Text Label 4800 3050 0    40   ~ 0
ROW4
Text Label 4800 3150 0    40   ~ 0
ROW5
Text Label 4800 3450 0    40   ~ 0
COL8
Text Label 4800 3550 0    40   ~ 0
COL1
Text Label 4800 3650 0    40   ~ 0
COL7
Text Label 4800 3750 0    40   ~ 0
COL6
Text Label 4800 3850 0    40   ~ 0
COL2
Text Label 4800 3950 0    40   ~ 0
COL3
Text Label 4800 4050 0    40   ~ 0
COL4
Text Label 4800 4150 0    40   ~ 0
COL5
$Comp
L CONN_18 P1
U 1 1 52A46D8F
P 5250 3400
F 0 "P1" V 5300 3400 60  0000 C CNN
F 1 "CONN_18" V 5400 3400 60  0000 C CNN
F 2 "" H 5250 3400 60  0000 C CNN
F 3 "" H 5250 3400 60  0000 C CNN
	1    5250 3400
	1    0    0    -1  
$EndComp
$Comp
L GND #PWR?
U 1 1 52A46D9E
P 4750 4350
F 0 "#PWR?" H 4750 4350 30  0001 C CNN
F 1 "GND" H 4750 4280 30  0001 C CNN
F 2 "" H 4750 4350 60  0000 C CNN
F 3 "" H 4750 4350 60  0000 C CNN
	1    4750 4350
	1    0    0    -1  
$EndComp
Wire Wire Line
	5000 2650 4800 2650
Wire Wire Line
	5000 2750 4800 2750
Wire Wire Line
	5000 2850 4800 2850
Wire Wire Line
	5000 2950 4800 2950
Wire Wire Line
	5000 3050 4800 3050
Wire Wire Line
	5000 3150 4800 3150
Wire Wire Line
	5000 3550 4800 3550
Wire Wire Line
	5000 3650 4800 3650
Wire Wire Line
	5000 3750 4800 3750
Wire Wire Line
	5000 3850 4800 3850
Wire Wire Line
	5000 3950 4800 3950
Wire Wire Line
	5000 4050 4800 4050
Wire Wire Line
	5000 4150 4800 4150
Wire Wire Line
	5000 2550 4750 2550
Wire Wire Line
	4750 4250 5000 4250
Connection ~ 4750 4250
Wire Wire Line
	4750 3350 5000 3350
Connection ~ 4750 3350
Wire Wire Line
	4750 2550 4750 4350
Wire Wire Line
	5000 3450 4800 3450
Wire Wire Line
	5000 3250 4750 3250
Connection ~ 4750 3250
$Comp
L CONN_14 P2
U 1 1 53C24053
P 6750 3400
F 0 "P2" V 6720 3400 60  0000 C CNN
F 1 "CONN_14" V 6830 3400 60  0000 C CNN
F 2 "" H 6750 3400 60  0000 C CNN
F 3 "" H 6750 3400 60  0000 C CNN
	1    6750 3400
	1    0    0    -1  
$EndComp
Wire Wire Line
	6400 2750 6150 2750
Wire Wire Line
	6400 2850 6150 2850
Wire Wire Line
	6400 2950 6150 2950
Wire Wire Line
	6400 3050 6150 3050
Wire Wire Line
	6400 3150 6150 3150
Wire Wire Line
	6400 3250 6150 3250
Wire Wire Line
	6400 3350 6150 3350
Wire Wire Line
	6400 3450 6150 3450
Wire Wire Line
	6400 3550 6150 3550
Wire Wire Line
	6400 3650 6150 3650
Wire Wire Line
	6400 3750 6150 3750
Wire Wire Line
	6400 3850 6150 3850
Wire Wire Line
	6400 3950 6150 3950
Wire Wire Line
	6400 4050 6150 4050
$EndSCHEMATC
