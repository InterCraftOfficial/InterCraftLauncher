(function () {'use strict';

const jetpack = require('fs-jetpack');
const jsonfile = require('jsonfile');

const config = require('./config');

let minecraftDir;
let launcherProfiles;

exports.init = function() {
	var result = true;
	minecraftDir = jetpack.cwd(config.minecraftPath());
	result = result && directoryExists();
	result = result && filesExist();
	result = result && loadLauncherProfiles();

	// Add missing stuff to prevent any crashing
	initLauncherProfiles();
	loadInstalledVersions();

	return result;
};

var directoryExists = function() {
	return jetpack.exists(minecraftDir.path()) == 'dir';
};

var filesExist = function() {
	var result = true;
	result = result && jetpack.exists(minecraftDir.path('launcher_profiles.json'));
	return result;
};

var loadLauncherProfiles = function() {
	launcherProfiles = jsonfile.readFileSync(minecraftDir.path('launcher_profiles.json'), {throws: false});
	return launcherProfiles != null; // This is kinda bad, not telling the user that their launcher_profiles.json is corrupted
};

var initLauncherProfiles = function() {
	if (launcherProfiles.authenticationDatabase == undefined)
		launcherProfiles.authenticationDatabase = {};
};

var loadInstalledVersions = function() {
	
};

exports.settings = function() {
	return launcherProfiles.settings;
};

exports.setSettings = function(settings) {
	launcherProfiles.settings = settings;
};

exports.clientToken = function() {
	return launcherProfiles.clientToken();
};

exports.generateClientToken = function() {
	var chars = '0123456789abcdef';
	var token = '';
	for (var i = 0; i < 36; i++)
		if (i>7 && i<24 && (i-8)%5 == 0)
			token += '-';
		else
			token += chars[Math.floor(Math.random()*16)];
	exports.setClientToken(token);
};

exports.setClientToken = function(token) {
	launcherProfiles.clientToken = token;
};

exports.profiles = function() {
	return launcherProfiles.profiles;
};

exports.setProfiles = function(profiles) {
	launcherProfiles.profiles = profiles;
};

exports.accounts = function() {
	return launcherProfiles.authenticationDatabase;
};

exports.setProfile = function(id, value) {
	launcherProfiles.authenticationDatabase[id] = value;
};

exports.addProfile = function(id, accessToken, email, uuid, username) {
	var profile = {
		"accessToken": accessToken,
		"username": email,
		"profiles": {
		}
	};
	profile.profiles[uuid] = {
		"displayName": username
	};
	launcherProfiles.authenticationDatabase[id] = profile;
};

exports.save = function() {
	jsonfile.writeFileSync(minecraftDir.path('launcher_profiles.json'), launcherProfiles, {spaces: 2});
};

}());
//# sourceMappingURL=minecraft.js.map