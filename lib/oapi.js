const ApiGroup = require('kubernetes-client/lib/api-group');

class OApi extends ApiGroup {
  constructor(options) {

    const commonResources = [
      'buildconfigs',
      'routes',
      'users',
      'deploymentconfigs',
      'deploymentconfigrollbacks',
    ];

    options = Object.assign({}, options, {
      path: 'oapi',
      version: options.version || 'v1',
      // TODO: add any custom resource implementations
      groupResources: commonResources,
      // TODO: add any custom resource implementations
      namespaceResources: commonResources
    });
    super(options);
  }
}

module.exports = OApi;
