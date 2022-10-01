/**
 * Generated by Verge3D Puzzles v.4.1.0
 * Thu Sep 29 2022 17:02:00 GMT+0530 (India Standard Time)
 * Prefer not editing this file as your changes may get overridden once Puzzles are saved.
 * Check out https://www.soft8soft.com/docs/manual/en/introduction/Using-JavaScript.html
 * for the information on how to add your own JavaScript to Verge3D apps.
 */

'use strict';

(function() {

// global variables/constants used by puzzles' functions

var LIST_NONE = '<none>';

var _pGlob = {};

_pGlob.objCache = {};
_pGlob.fadeAnnotations = true;
_pGlob.pickedObject = '';
_pGlob.hoveredObject = '';
_pGlob.mediaElements = {};
_pGlob.loadedFile = '';
_pGlob.states = [];
_pGlob.percentage = 0;
_pGlob.openedFile = '';
_pGlob.openedFileMeta = {};
_pGlob.xrSessionAcquired = false;
_pGlob.xrSessionCallbacks = [];
_pGlob.screenCoords = new v3d.Vector2();
_pGlob.intervalTimers = {};
_pGlob.customEvents = new v3d.EventDispatcher();

_pGlob.AXIS_X = new v3d.Vector3(1, 0, 0);
_pGlob.AXIS_Y = new v3d.Vector3(0, 1, 0);
_pGlob.AXIS_Z = new v3d.Vector3(0, 0, 1);
_pGlob.MIN_DRAG_SCALE = 10e-4;
_pGlob.SET_OBJ_ROT_EPS = 1e-8;

_pGlob.vec2Tmp = new v3d.Vector2();
_pGlob.vec2Tmp2 = new v3d.Vector2();
_pGlob.vec3Tmp = new v3d.Vector3();
_pGlob.vec3Tmp2 = new v3d.Vector3();
_pGlob.vec3Tmp3 = new v3d.Vector3();
_pGlob.vec3Tmp4 = new v3d.Vector3();
_pGlob.eulerTmp = new v3d.Euler();
_pGlob.eulerTmp2 = new v3d.Euler();
_pGlob.quatTmp = new v3d.Quaternion();
_pGlob.quatTmp2 = new v3d.Quaternion();
_pGlob.colorTmp = new v3d.Color();
_pGlob.mat4Tmp = new v3d.Matrix4();
_pGlob.planeTmp = new v3d.Plane();
_pGlob.raycasterTmp = new v3d.Raycaster();

var PL = v3d.PL = v3d.PL || {};

// a more readable alias for PL (stands for "Puzzle Logic")
v3d.puzzles = PL;

PL.procedures = PL.procedures || {};




PL.execInitPuzzles = function(options) {
    // always null, should not be available in "init" puzzles
    var appInstance = null;
    // app is more conventional than appInstance (used in exec script and app templates)
    var app = null;

    var _initGlob = {};
    _initGlob.percentage = 0;
    _initGlob.output = {
        initOptions: {
            fadeAnnotations: true,
            useBkgTransp: false,
            preserveDrawBuf: false,
            useCompAssets: false,
            useFullscreen: true,
            useCustomPreloader: false,
            preloaderStartCb: function() {},
            preloaderProgressCb: function() {},
            preloaderEndCb: function() {},
        }
    }

    // provide the container's id to puzzles that need access to the container
    _initGlob.container = options !== undefined && 'container' in options
            ? options.container : "";

    

    // initSettings puzzle
_initGlob.output.initOptions.fadeAnnotations = true;
_initGlob.output.initOptions.useBkgTransp = true;
_initGlob.output.initOptions.preserveDrawBuf = false;
_initGlob.output.initOptions.useCompAssets = false;
_initGlob.output.initOptions.useFullscreen = false;


// initPreloader puzzle
_initGlob.output.initOptions.useCustomPreloader = true;
_initGlob.output.initOptions.preloaderStartCb = function() {
    _initGlob.percentage = 0;
    (function() {})();
};
_initGlob.output.initOptions.preloaderProgressCb = function(percentage) {
    _initGlob.percentage = percentage;
    (function() {})();
};
_initGlob.output.initOptions.preloaderEndCb = function() {
    _initGlob.percentage = 100;
    (function() {})();
};

    return _initGlob.output;
}

PL.init = function(appInstance, initOptions) {

// app is more conventional than appInstance (used in exec script and app templates)
var app = appInstance;

initOptions = initOptions || {};

if ('fadeAnnotations' in initOptions) {
    _pGlob.fadeAnnotations = initOptions.fadeAnnotations;
}



var camera_moving;

// enableRendering puzzle
function enableRendering() {
    appInstance.enableRendering();
}

// disableRendering puzzle
function disableRendering(enableSSAA) {
    appInstance.ssaaOnPause = enableSSAA;
    appInstance.disableRendering(1);
}

// everyFrame puzzle
function registerEveryFrame(callback) {
    if (typeof callback == 'function') {
        appInstance.renderCallbacks.push(callback);
        if (v3d.PL.editorRenderCallbacks)
            v3d.PL.editorRenderCallbacks.push([appInstance, callback]);
    }
}

// autoRotateCamera puzzle
function autoRotateCamera(enabled, speed) {

    if (appInstance.controls && appInstance.controls instanceof v3d.OrbitControls) {
        appInstance.controls.autoRotate = enabled;
        appInstance.controls.autoRotateSpeed = speed;
    } else {
        console.error('autorotate camera: Wrong controls type');
    }
}

function setScreenScale(factor) {

    // already have maximum pixel ratio in HiDPI mode
    if (!appInstance.useHiDPIRenderPass)
        appInstance.renderer.setPixelRatio(factor);

    if (appInstance.postprocessing)
        appInstance.postprocessing.composer.setPixelRatio(factor);

    // to update possible post-processing passes
    appInstance.onResize();
}

// bloom puzzle
function bloom(threshold, strength, radius) {
    appInstance.enablePostprocessing([{
        type: 'bloom',
        threshold: threshold,
        strength: strength,
        radius: radius
    }]);
}

// utility function envoked by almost all V3D-specific puzzles
// filter off some non-mesh types
function notIgnoredObj(obj) {
    return obj.type !== 'AmbientLight' &&
           obj.name !== '' &&
           !(obj.isMesh && obj.isMaterialGeneratedMesh) &&
           !obj.isAuxClippingMesh;
}


// utility function envoked by almost all V3D-specific puzzles
// find first occurence of the object by its name
function getObjectByName(objName) {
    var objFound;
    var runTime = _pGlob !== undefined;
    objFound = runTime ? _pGlob.objCache[objName] : null;

    if (objFound && objFound.name === objName)
        return objFound;

    if (appInstance.scene) {
        appInstance.scene.traverse(function(obj) {
            if (!objFound && notIgnoredObj(obj) && (obj.name == objName)) {
                objFound = obj;
                if (runTime) {
                    _pGlob.objCache[objName] = objFound;
                }
            }
        });
    }
    return objFound;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects on the scene
function getAllObjectNames() {
    var objNameList = [];
    appInstance.scene.traverse(function(obj) {
        if (notIgnoredObj(obj))
            objNameList.push(obj.name)
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects which belong to the group
function getObjectNamesByGroupName(targetGroupName) {
    var objNameList = [];
    appInstance.scene.traverse(function(obj){
        if (notIgnoredObj(obj)) {
            var groupNames = obj.groupNames;
            if (!groupNames)
                return;
            for (var i = 0; i < groupNames.length; i++) {
                var groupName = groupNames[i];
                if (groupName == targetGroupName) {
                    objNameList.push(obj.name);
                }
            }
        }
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// process object input, which can be either single obj or array of objects, or a group
function retrieveObjectNames(objNames) {
    var acc = [];
    retrieveObjectNamesAcc(objNames, acc);
    return acc.filter(function(name) {
        return name;
    });
}

function retrieveObjectNamesAcc(currObjNames, acc) {
    if (typeof currObjNames == "string") {
        acc.push(currObjNames);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "GROUP") {
        var newObj = getObjectNamesByGroupName(currObjNames[1]);
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "ALL_OBJECTS") {
        var newObj = getAllObjectNames();
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames)) {
        for (var i = 0; i < currObjNames.length; i++)
            retrieveObjectNamesAcc(currObjNames[i], acc);
    }
}

// getActiveCamera puzzle
function getActiveCamera() {
    var camera = appInstance.getCamera();
    return camera.name;
}

// whenMoved puzzle
function whenMoved(objSelector, velocity, cbStart, cbMove, cbStop) {

    _pGlob.objMovementInfos = _pGlob.objMovementInfos || {};

    function savePreviousCoords(objName, obj, prevIsMoving) {
        // GC optimization
        if (_pGlob.objMovementInfos[objName]) {
            var info = _pGlob.objMovementInfos[objName];

            info.prevPosX = obj.position.x;
            info.prevPosY = obj.position.y;
            info.prevPosZ = obj.position.z;
            info.prevRotX = obj.rotation.x;
            info.prevRotY = obj.rotation.y;
            info.prevRotZ = obj.rotation.z;
            info.prevScaX = obj.scale.x;
            info.prevScaY = obj.scale.y;
            info.prevScaZ = obj.scale.z;
            info.prevIsMoving = prevIsMoving;
        } else {
            var info = {
                prevPosX: obj.position.x,
                prevPosY: obj.position.y,
                prevPosZ: obj.position.z,
                prevRotX: obj.rotation.x,
                prevRotY: obj.rotation.y,
                prevRotZ: obj.rotation.z,
                prevScaX: obj.scale.x,
                prevScaY: obj.scale.y,
                prevScaZ: obj.scale.z,
                prevIsMoving: prevIsMoving
            };
            _pGlob.objMovementInfos[objName] = info;
        }

        return info;
    }

    function checkMoving(objName, obj, elapsed) {

        var info = _pGlob.objMovementInfos[objName] ||
            savePreviousCoords(objName, obj, false);

        var delta = velocity * elapsed;

        var isMoving =
            Math.abs(obj.position.x - info.prevPosX) > delta ||
            Math.abs(obj.position.y - info.prevPosY) > delta ||
            Math.abs(obj.position.z - info.prevPosZ) > delta ||
            Math.abs(obj.rotation.x - info.prevRotX) > delta ||
            Math.abs(obj.rotation.y - info.prevRotY) > delta ||
            Math.abs(obj.rotation.z - info.prevRotZ) > delta ||
            Math.abs(obj.scale.x - info.prevScaX) > delta ||
            Math.abs(obj.scale.y - info.prevScaY) > delta ||
            Math.abs(obj.scale.z - info.prevScaZ) > delta;

        if (!info.prevIsMoving && isMoving) {
            cbStart(objName);
            savePreviousCoords(objName, obj, true);
        } else if (info.prevIsMoving && isMoving) {
            cbMove(objName);
            savePreviousCoords(objName, obj, true);
        } else if (info.prevIsMoving && !isMoving) {
            cbStop(objName);
            savePreviousCoords(objName, obj, false);
        } else {
            savePreviousCoords(objName, obj, false);
        }
    }

    function addToRender(objSelector) {

        function renderCb(elapsed, timeline) {

            var objNames = retrieveObjectNames(objSelector);

            for (var i = 0; i < objNames.length; i++) {
                var objName = objNames[i];

                var obj = getObjectByName(objName);
                if (!obj)
                    return;

                checkMoving(objName, obj, elapsed);
            }
        }

        appInstance.renderCallbacks.push(renderCb);
        if (v3d.PL.editorRenderCallbacks)
            v3d.PL.editorRenderCallbacks.push([appInstance, renderCb]);

    }

    addToRender(objSelector);

}

// ssr puzzle
function ssr(type, matName, steps, stride, binarySearchSteps, thickness,
        maxDistance, resolution, jitter, renderAfterSelector) {

    var useRefract = (type == 'REFRACT') ? true : false;

    var matNames = Array.isArray(matName) ? matName : [matName];
    var mats = [];

    matNames.forEach(function(name) {
        mats = mats.concat(v3d.SceneUtils.getMaterialsByName(appInstance, name));
    });

    var objects = [];

    for (var i = 0; i < mats.length; i++) {
        var mat = mats[i];

        appInstance.scene.traverse(function(obj) {
            if (obj.material && obj.material == mat)
                objects.push(obj);
        });
    }

    // no need
    if (!objects.length)
        return;

    var renderAfter = [];

    var renderAfterNames = retrieveObjectNames(renderAfterSelector);

    for (var i = 0; i < renderAfterNames.length; i++) {
        var obj = getObjectByName(renderAfterNames[i]);
        if (obj)
            renderAfter.push(obj);
    }

    appInstance.enablePostprocessing([{
        type: 'ssr',
        useRefract: useRefract,
        objects: objects,
        steps: steps,
        stride: stride,
        binarySearchSteps: binarySearchSteps,
        thickness: thickness,
        maxDistance: maxDistance,
        renderTargetScale: resolution,
        jitter: jitter,
        renderAfter: renderAfter
    }]);
}


registerEveryFrame(function() {
  if (camera_moving == true) {
    enableRendering();
  } else {
    disableRendering(true);
  }
});

autoRotateCamera(true, 0.75);

camera_moving = false;

setScreenScale(1);

bloom(1, 0.5, 0.2);

whenMoved(getActiveCamera(), 0.01, function() {
  camera_moving = true;
}, function() {}, function() {
  camera_moving = false;
});

ssr('REFRACT', 'glass', 100, 5, 4, 0.01, 100, 0.5, 1, 'Scene');



} // end of PL.init function

})(); // end of closure

/* ================================ end of code ============================= */
