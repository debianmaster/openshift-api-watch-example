# openshift-client-scratch

Example using kubernetes-client to implement an OpenShift client.

## Using

```js
// NB: This is not actually published to npm
const OpenShiftClient = require('openshift-client-scratch');

const oapi = new OpenShiftClient.OApi(OpenShiftClient.config.fromKubeconfig());
oapi.ns('foo').deploymentconfigs('bar').get((err, result) => {
  if (err) throw err;
  console.log(JSON.stringify(result, null, 2));
});
```
```sh
oc adm policy add-scc-to-user anyuid -z default
cp ~/.kube/config config
oc create cm kubeconfig --from-file=config
oc volume dc/watch --add  -m /root/.kube/ -t configmap --configmap-name=kubeconfig
```
