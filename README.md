# CAWGL (Class Abstraction WebGL)
CAWGL is a (micro) framework which provides an abstraction over WebGL objects using classes. 
This provides experienced developers the control they want in a nice object oriented package.
It hides all the verbose WebGL calls and makes it a bit more clear to see what is happening.
It supports WebGL2 Feature like 3D textures and VAO's out of the box.

## WebGL1
WebGL 1 needs a small wrapper to be called so the extensions for VAO's can be used.
When developing applications using WebGL1 be aware that you don't need to specify the version directive in shaders.
The 2D texture array and 3D textures are also not supported in WebGL1.
If you're wondering if some features are available check the wonderfull documentation by (https://webglfundamentals.org/)[Greggman]