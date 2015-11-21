from scipy.optimize import fsolve
#from math import sin,cos
import sys
#print sys.argv
#$pointA[0].$pointA[1].$pointA[2].$pointB[0].$pointB[1].$pointB[2].$distance

pointAx=float(sys.argv[1])
pointAy=float(sys.argv[2])
pointAz=float(sys.argv[3])
pointBx=float(sys.argv[4])
pointBy=float(sys.argv[5])
pointBz=float(sys.argv[6])
distance=float(sys.argv[7])

def f(k):
    x = float(k[0])
    y = float(k[1])
    z = float(k[2])
    return [
            (pointAx-pointBx)*(x-pointBx)+(pointAy-pointBy)*(y-pointBy)+(pointAz-pointBz)*(z-pointBz),
            (x-pointBx)**2+(y-pointBy)**2+(z-pointBz)**2-distance**2,
            (x/6378137.0)**2+(y/6378137.0)**2+(z/6356752.314245)**2
    ]
    #return [
    #    (pointA.x-pointB.x)*(x-pointB.x)+(pointA.y-pointB.y)*(y-pointB.y)+(pointA.z-pointB.z)*(z-pointB.z),
    #    (x-pointB.x)**2+(y-pointB.y)**2+(z-pointB.z)**2-distance**2,
    #    (x/6378137.0)**2+(y/6378137.0)**2+(z/6356752.314245)**2
    #]
    #return [
    #    (1931867.871-1926086.99)*(x-1926086.99)+(5181225.0204-5185483.0982)*(y-5185483.0982)+(3866969.856-3864170.96)*(z-3864170.96),
     #   (x-1926086.99)**2+(y-5185483.0982)**2+(z-3864170.96)**2-600000**2,
      #  (x/6378137.0)**2+(y/6378137.0)**2+(z/6356752.314245)**2
    #]

'''
    return [
        (x1-x2)(x-x2)+(y1-y2)(y-y2)+(z1-z2)(z-z2),
        (x-x2)**2+(y-y2)**2+(z-z2)**2-s**2,
        (x/a)**2+(y/b)**2+(z/c)**2
    ]
'''

result = fsolve(f, [pointBx,pointBy,pointBz])

print result
#print f(result)