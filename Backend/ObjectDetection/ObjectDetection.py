from collections import deque
import numpy as np
import sys
import imutils
import cv2

def detectObject(frame, lower, upper):
    frame = imutils.resize(frame, width=600)

    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    mask = cv2.inRange(hsv, lower, upper)
    mask = cv2.erode(mask, None, iterations=2)
    mask = cv2.dilate(mask, None, iterations=2)

    cnts = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[-2]
    center = None

    if len(cnts) > 0:
        return True
    return False

def main():
    #Red
    #lower = (170, 200, 200)
    #upper = (179, 255, 255)

    #Green
    lower = (29, 86, 6)
    upper = (64, 255, 255)

    detectObject(sys.argv[1], lower, upper)

if __name__ == '__main__':
    main()
