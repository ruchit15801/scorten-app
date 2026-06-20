const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch entire monorepo
config.watchFolders = [workspaceRoot];

// CRITICAL: project-local node_modules FIRST, then workspace root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Disable hierarchical lookup so root packages don't override local ones
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
