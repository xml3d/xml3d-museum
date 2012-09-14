XML3D.shaders.register("normal", {

    vertex : [
       "attribute vec3 position;",
         "attribute vec3 normal;",
         "attribute vec3 tangent;",
         "attribute vec2 texcoord;",

         "varying vec3 normalVS;",
         "varying vec3 positionVS;",
         "varying vec2 texcoordMS;",
         "varying vec3 viewVecTS;",

         "#if MAX_DIRECTIONALLIGHTS > 0",
         "uniform vec3 directionalLightDirection[MAX_DIRECTIONALLIGHTS];",
         "varying vec3 directionalLightDirectionTS[MAX_DIRECTIONALLIGHTS];",
         "#endif",

         "uniform mat4 modelViewProjectionMatrix;", // model -> world -> view -> screen
         "uniform mat4 modelViewMatrix;",           // model -> world -> view
         "uniform mat3 normalMatrix;",              // model -> world -> view (normals)
         "uniform mat4 viewMatrix;",                // world -> view

         "void main(void) {",
         "    normalVS = normalMatrix * normal;", // normal in view space
         "    positionVS = (modelViewMatrix * vec4(position, 1.0)).xyz;", // position in view space

         "    texcoordMS = texcoord;", // texture coordinates in model space

         "    vec3 tangentVS = normalize(normalMatrix * tangent);", // tangent in view space
         "    vec3 bitangentVS = cross(tangentVS, normalVS);", // bi-tangent in view space

         "    vec3 viewVec = normalize(-positionVS);",
         "    viewVecTS = vec3(dot(viewVec, tangentVS), dot(viewVec, bitangentVS), dot(viewVec, normalVS));",

         // Tangent to matrix
         "#if MAX_DIRECTIONALLIGHTS > 0",
         "    vec3 v;",
         "    for (int i=0; i<MAX_DIRECTIONALLIGHTS; i++) {",
         "      vec3 lVec = (viewMatrix * vec4(directionalLightDirection[i],0.0)).xyz;",
         "      v.x = dot(lVec, tangentVS);",
         "      v.y = dot(lVec, bitangentVS);",
         "      v.z = dot(lVec, normalVS);",
         "      directionalLightDirectionTS[i] = v;",
         "    }",
         "#endif",

         "    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);",

         "}",
    ].join("\n"),

    fragment : [
        "#ifdef GL_ES",
           "precision highp float;",
           "#endif\n",
           "uniform float ambientIntensity;",
           "uniform vec3 diffuseColor;",
           "uniform vec3 emissiveColor;",
           "uniform float shininess;",
           "uniform vec3 specularColor;",
           "uniform float transparency;",
           
           "#if HAS_DIFFUSETEXTURE",
             "uniform sampler2D diffuseTexture;",
           "#endif",
           "#if HAS_SPECULARTEXTURE",
              "uniform sampler2D specularTexture;",
           "#endif",
           
           "uniform sampler2D normalTexture;",

           "varying vec3 normalVS;",
           "varying vec3 positionVS;",
           "varying vec2 texcoordMS;",
           "varying vec3 viewVecTS;",

           "#if MAX_DIRECTIONALLIGHTS > 0",
           "uniform vec3 directionalLightDirection[MAX_DIRECTIONALLIGHTS];",
           "uniform vec3 directionalLightIntensity[MAX_DIRECTIONALLIGHTS];",
           "uniform vec3 directionalLightVisibility[MAX_DIRECTIONALLIGHTS];",
           "varying vec3 directionalLightDirectionTS[MAX_DIRECTIONALLIGHTS];",
           "#endif",

           "void main(void) {",
           "  float alpha =  max(0.0, 1.0 - transparency);",
           "  vec3 objDiffuse = diffuseColor;",
           "  #if HAS_DIFFUSETEXTURE",
           "    vec4 texDiffuse = texture2D(diffuseTexture, texcoordMS);",
           "    alpha *= texDiffuse.a;",
           "    objDiffuse *= texDiffuse.rgb;",
           "  #endif",
           "  if (alpha < 0.05) discard;",
           
           "  vec3 normalTS = normalize(texture2D(normalTexture, texcoordMS).xyz * 2.0 - 1.0);",
           
           "  vec3 objSpecular = specularColor;",
           "  #if HAS_SPECULARTEXTURE",
           "    objSpecular = objSpecular * texture2D(specularTexture, texcoordMS).rgb;",
           "  #endif",
           "  vec3 color = objDiffuse * ambientIntensity + emissiveColor;",
           
           "  vec3 viewVec = normalize(viewVecTS);",
           "  vec3 R = reflect(-viewVec, normalTS);",
           
           "#if MAX_DIRECTIONALLIGHTS > 0",
           "  for (int i=0; i<MAX_DIRECTIONALLIGHTS; i++) {",
           "    vec3 L =  normalize(directionalLightDirectionTS[i]);",
           "    vec3 Idiff = directionalLightIntensity[i] * objDiffuse  * max(dot(L,normalTS),0.0);",
           "    float specular = pow(clamp(dot(R, L), 0.0, 1.0), shininess*128.0); ",
           "    vec3 Ispec = directionalLightIntensity[i] * objSpecular * specular;",
           "    color = color + ( Idiff + Ispec ) * directionalLightVisibility[i];",
           "  }",
           "#endif",

           "  gl_FragColor = vec4(color, alpha);",
           "}"
    ].join("\n"),

    addDirectives: function(directives, lights, params) {
        var directionalLights = lights.directional ? lights.directional.length : 0;
        directives.push("MAX_DIRECTIONALLIGHTS " + directionalLights);
        directives.push("HAS_DIFFUSETEXTURE " + ('diffuseTexture' in params ? "1" : "0"));
        directives.push("HAS_SPECULARTEXTURE " + ('specularTexture' in params ? "1" : "0"));
    },
    hasTransparency: function(params) {
        return params.transparency && params.transparency.getValue()[0] > 0.001;
    },
    uniforms: {
        diffuseColor    : [1.0, 1.0, 1.0],
        emissiveColor   : [0.0, 0.0, 0.0],
        specularColor   : [1.0, 1.0, 1.0],
        transparency    : 0.0,
        shininess       : 0.5,
        ambientIntensity: 0.0
    },

    samplers: {
        diffuseTexture : null,
        normalTexture : null,
        specularTexture : null
    }
});

XML3D.shaders.register("reflection", {

    vertex : [
       "attribute vec3 position;",
         "attribute vec3 normal;",
         "attribute vec3 tangent;",
         "attribute vec2 texcoord;",

         "varying vec3 normalVS;",
         "varying vec3 positionVS;",
         "varying vec2 texcoordMS;",
         "varying vec3 viewVecTS;",
         "varying vec3 reflVector;",

         "#if MAX_DIRECTIONALLIGHTS > 0",
           "uniform vec3 directionalLightDirection[MAX_DIRECTIONALLIGHTS];",
           "varying vec3 directionalLightDirectionTS[MAX_DIRECTIONALLIGHTS];",
         "#endif",

         "uniform mat4 modelViewProjectionMatrix;", // model -> world -> view -> screen
         "uniform mat4 modelViewMatrix;",           // model -> world -> view
         "uniform mat4 modelMatrix;",				// model -> world
         "uniform mat3 normalMatrix;",              // model -> world -> view (normals)
         "uniform mat4 viewMatrix;",                // world -> view
         "uniform vec3 cameraPosition;",

         "void main(void) {",
         "    normalVS = normalMatrix * normal;", // normal in view space
         "    positionVS = (modelViewMatrix * vec4(position, 1.0)).xyz;", // position in view space

         "    texcoordMS = texcoord;", // texture coordinates in model space

         // Calculate reflection vector
         "    vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;",
         "    vec3 worldNorm = normalize(mat3(modelMatrix) * normal).xyz;",
         "	  vec3 E = normalize(worldPos - cameraPosition);",
         "    reflVector = reflect(E, worldNorm);",

         "    vec3 tangentVS = normalize(normalMatrix * tangent);", // tangent in view space
         "    vec3 bitangentVS = cross(tangentVS, normalVS);", // bi-tangent in view space

         "    vec3 viewVec = normalize(-positionVS);",
         "    viewVecTS = vec3(dot(viewVec, tangentVS), dot(viewVec, bitangentVS), dot(viewVec, normalVS));",

         // Tangent to matrix
         "#if MAX_DIRECTIONALLIGHTS > 0",
         "    vec3 v;",
         "    for (int i=0; i<MAX_DIRECTIONALLIGHTS; i++) {",
         "      vec3 lVec = (viewMatrix * vec4(directionalLightDirection[i],0.0)).xyz;",
         "      v.x = dot(lVec, tangentVS);",
         "      v.y = dot(lVec, bitangentVS);",
         "      v.z = dot(lVec, normalVS);",
         "      directionalLightDirectionTS[i] = v;",
         "    }",
         "#endif",

         "    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);",

         "}"
    ].join("\n"),

    fragment : [
        "#ifdef GL_ES",
           "precision highp float;",
           "#endif\n",
           "uniform float ambientIntensity;",
           "uniform vec3 diffuseColor;",
           "uniform vec3 emissiveColor;",
           "uniform float shininess;",
           "uniform vec3 specularColor;",
           "uniform float transparency;",
           
           "#if HAS_DIFFUSETEXTURE",
             "uniform sampler2D diffuseTexture;",
           "#endif",
           "#if HAS_SPECULARTEXTURE",
             "uniform sampler2D specularTexture;",
           "#endif",
           "#if HAS_NORMALTEXTURE",
             "uniform sampler2D normalTexture;",
           "#endif",

           "uniform sampler2D reflectionTexture;",
           "uniform float reflectivity;",

           "varying vec3 normalVS;",
           "varying vec3 positionVS;",
           "varying vec2 texcoordMS;", 
           "varying vec3 viewVecTS;",
           "varying vec3 reflVector;",

           "#if MAX_DIRECTIONALLIGHTS > 0",
             "uniform vec3 directionalLightIntensity[MAX_DIRECTIONALLIGHTS];",
             "uniform vec3 directionalLightVisibility[MAX_DIRECTIONALLIGHTS];",
             "uniform vec3 directionalLightDirection[MAX_DIRECTIONALLIGHTS];",
             "varying vec3 directionalLightDirectionTS[MAX_DIRECTIONALLIGHTS];",
           "#endif",

           "void main(void) {",
           //Dual paraboloid reflection mapping
		   //Very specific to the museum scene!
		   //"  float rSign = rNorm.z / abs(rNorm.z);", //-1 if we're sampling the back face, 1 if front
           //"  vec2 reflUV = (rNorm.xy / (2.0*(1.0 + abs(rNorm.z)))) + 0.5;",

           "  vec3 rNorm = normalize(reflVector);",
           "  float rSign = rNorm.x / abs(rNorm.x);", //-1 if we're sampling the back face, 1 if front
           "  vec2 reflUV = (rNorm.zy / (2.0*(1.0 + abs(rNorm.x)))) + 0.5;",
		   "  reflUV = reflUV.yx;",
           "  reflUV.x = reflUV.x*0.5 + (rSign + 1.0) * 0.25;", //offset to either the front or back half of the refl texture
           "  vec4 texRefl = texture2D(reflectionTexture, reflUV);",

           //Normal
           "  vec3 viewVec = normalize(viewVecTS);",
           "  vec3 normalTS = normalize(normalVS);",
           "  #if HAS_NORMALTEXTURE",
           "  	normalTS = normalize(texture2D(normalTexture, texcoordMS).rgb * 2.0 - 1.0);",
           "  #endif",
           "  vec3 R = reflect(-viewVec, normalTS);",

           //Diffuse
           "  float alpha =  max(0.0, 1.0 - transparency);",
           "  vec3 objDiffuse = diffuseColor;",
           "  #if HAS_DIFFUSETEXTURE",
           "    vec4 texDiffuse = texture2D(diffuseTexture, texcoordMS);",
           "    alpha *= texDiffuse.a;",
           "    objDiffuse *= texDiffuse.rgb;",
           "  #endif",
           "  if (alpha < 0.05) discard;",
           
           //Specular
           "  vec3 objSpecular = specularColor;",
           "  #if HAS_SPECULARTEXTURE",
           "    objSpecular = objSpecular * texture2D(specularTexture, texcoordMS).rgb;",
           "  #endif",
           "  vec3 color = objDiffuse * ambientIntensity + emissiveColor + texRefl.rgb*reflectivity;",

           "#if MAX_DIRECTIONALLIGHTS > 0",
           "  for (int i=0; i<MAX_DIRECTIONALLIGHTS; i++) {",
           "    vec3 L =  normalize(directionalLightDirectionTS[i]);",
           "    vec3 Idiff = directionalLightIntensity[i] * objDiffuse  * max(dot(L,normalTS),0.0);",
           "    float specular = pow(clamp(dot(R, L), 0.0, 1.0), shininess*128.0); ",
           "    vec3 Ispec = directionalLightIntensity[i] * objSpecular * specular;",
           "    color = color + (Ispec + Idiff);// * directionalLightVisibility[i];",
           "  }",
           "#endif",
           "  gl_FragColor = vec4(color, alpha);",
           "}"
    ].join("\n"),

    addDirectives: function(directives, lights, params) {
        var directionalLights = lights.directional ? lights.directional.length : 0;
        directives.push("MAX_DIRECTIONALLIGHTS " + directionalLights);
        directives.push("HAS_DIFFUSETEXTURE " + ('diffuseTexture' in params ? "1" : "0"));
        directives.push("HAS_NORMALTEXTURE " + ('normalTexture' in params ? "1" : "0"));
        directives.push("HAS_SPECULARTEXTURE " + ('specularTexture' in params ? "1" : "0"));
    },
    hasTransparency: function(params) {
        return params.transparency && params.transparency.getValue()[0] > 0.001;
    },
    uniforms: {
        diffuseColor    : [1.0, 1.0, 1.0],
        emissiveColor   : [0.0, 0.0, 0.0],
        specularColor   : [1.0, 1.0, 1.0],
        transparency    : 0.0,
        shininess       : 0.5,
        ambientIntensity: 0.0,
        reflectivity    : 0.1
    },

    samplers: {
        diffuseTexture : null,
        normalTexture : null,
        specularTexture : null,
        reflectionTexture : null
    }
});