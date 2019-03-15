var Body = require('../objects/Body');
var Vec3 = require('../math/Vec3');
var Quaternion = require('../math/Quaternion');
var RaycastVehicle = require('../src/vehicle/RaycastVehicle');
var Utils = require('../utils/Utils');

module.exports = VehicleDynamicController;

/**
 * Vehicle helper class that casts rays from the wheel positions towards the ground and applies forces.
 * @class RaycastVehicle
 * @constructor
 * @param {Vehicle} The car.
 */
function VehicleDynamicController(vehicle, options){

    /**
     * @property {Vehicle} vehicle
     */
    this.vehicle = vehicle;

    options = Utils.defaults(options, {
        maxDriveForce : 10000,
        maxBrakeForce :10000,
        maxSteerRot : 0.5,
    })

    this.maxDriveForce = options.maxDriveForce;
    this.maxBrakeForce = options.maxBrakeForce;
    this.maxSteerRot = options.maxSteerRot;
    this.override = {};

    /**
     * @Property {object} yrsInfo
     */
    this.yrsInfo = {};

    /**
     * @Property {object} SASInfo
     */
    this.sasInfo = {};

    /**
     * @Property {object} vddmInfo
     */
    this.vddmInfo = {};

    /**
     * Basic Vehicle Infos
     */
    this.gasPedalOveride = false;
    this.brakePedalSwitchStatus = false;
    this.steerOveride = false;
}

/**
 * Set Vehicle DriverOverride
 * @method SetDriverOverride
 * @param {object}
 */
VehicleDynamicController.prototype.setDriverOverride = function(override){
    override = Utils.defaults(override, {
        gas : false,
        brake : false,
        steerLeft : false,
        steerRight : false,
        park : false,
        reverse : false
    })

    this.override.gas = override.gas;
    this.override.brake = override.brake;
    this.override.steerLeft = override.steerLeft;
    this.override.steerRight = override.steerRight;
    this.override.park = override.park;
    this.override.reverse = override.reverse;
}

/**
 * Set Vehicle ALOD.
 * @method setALOD
 * @param {object} ALOD
 */
VehicleDynamicController.prototype.setALOD = function(ALOD){
    ALOD = Utils.defaults(ALOD, {
        axvCvAim : 0,
        acceComfUpperValue : 0,
        acceComfLowerValue : 0,
        aDtUpperLimitAxvCv : 0,
        aDtLowerLimitAxcCv : 0,
        decToStopReq : 0,
        driveoffReq : 0,
        minimumBraking : 0,
        status : 0 // ALOD Mode
    });

    this.axvCvAim = ALOD.axvCvAim;
};

/**
 * Set Vehicle AEB Action. Assume always prefilled
 * @method setAEB
 * @param {object} AEB
 */
VehicleDynamicController.prototype.setAEB = function(AEB){
    AEB = Utils.defaults(AEB, {
        axTar : 0,
        abaRequest : 0,
        abaLevel : 0,
        awbRequest : 0,
        awbLevel : 0,
        vehicleHold : 0,
        decCCtrlAct : 0 // Active AEB
    });

    this.axTar = AEB.axTar;
};

/**
 * Set Vehicle ALAD. Assume always LKS mode
 * @method setALAD
 * @param {object} ALAD
 */
VehicleDynamicController.prototype.setALAD = function(ALAD){
    ALAD = Utils.defaults(ALAD, {
        torqueReq : 0,
        torqueReqDir : 0, //CW or CCW
        torqueReqAct : 0, // Active LKS
        status : 0 // ALAD Mode
    });

    this.torqueReq = ALAD.torqueReq;
};

/**
 * Set Vehicle APA
 * @method setAPA
 * @param {object} APA
 */
VehicleDynamicController.prototype.setAPA = function(APA){
    APA = Utils.defaults(APA, {
        axTarAim : 0,
        axTarUpperComfBand : 0,
        axTarLowerComfBand : 0,
        axTarUpperLimit : 0,
        axTarLowerLimit : 0,
        driveoffReq : 0,
        standstillReq : 0,
        stopDistancce : 0, // APA distance Mode
        escSpeedLimitation : 0, // APA distance Mode
        emergencyBrakeReq : 0,
        setSteeringWheelAng : 0,
        gearRequest : 0,
        epsControlRequest : 0, // Active or off EPS
        gearBoxEnable : 0, // Active or off Gear Change
        status : 0 // PAS Mode
    });
};

/**
 * Get the infomation from YRS
 * @method getYRSInfo
 * @return {object}
 */
VehicleDynamicController.prototype.getYRS = function(){
    return Utils.defaults(this.yrsInfo,{
        lateralAcce : 0,
        yawRate : 0,
        longitAcce : 0
    });
}

/**
 * Get the infomation from SAS
 * @method getSASInfo
 * @return {object}
 */
VehicleDynamicController.prototype.getSAS = function(){
    return Utils.defaults(this.sasInfo,{
        steerWheelAngle : 0,
        steerWheelRotSpd : 0
    });
}

/**
 * Get the infomation from ESC
 * @method getVDDMInfo
 * @return {object}
 */
VehicleDynamicController.prototype.getVDDM = function(){
    return Utils.defaults(this.vddmInfo,{
        vehicleSpeed : 0,
        epbStatus : 0,
        brakePedalSwitchStatus : 0,
        gasPedalOverride : 0,
        steeringWheelOverride : 0,
        currentGear : 0
    });
}

VehicleDynamicController.prototype.updateController = function(timeStep){

}