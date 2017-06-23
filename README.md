# openshift-client-scratch

Example using kubernetes-client to implement an OpenShift client.

## Using

```sh
oc adm policy add-scc-to-user anyuid -z default
export registry=$(oc get svc docker-registry -n default  -o jsonpath='{.spec.clusterIP}')
cp ~/.kube/config config
oc new-build https://github.com/debianmaster/openshift-api-watch-example --name=watch
oc new-build https://github.com/debianmaster/simple-scoreboard --name=dash
oc new-app watch-img --name=watch

oc patch dc watch --patch='
{ "spec": { 
    "template": {
      "spec": {
        "containers": [
          { "name" : "dash", 
            "image": "${registry}:5000/ci/dash-img:latest"
          }
        ], 
        "triggers": [
          { "type": "ImageChange", 
            "imageChangeParams": { 
              "from": { 
                "kind": "ImageStreamTag",
                "name": "dash-img:latest"
              },
              "containerNames": [ 
                "dashboard" 
              ] 
            } 
          } 
        ]
      }
    }
  }
}'
oc create cm kubeconfig --from-file=config
oc volume dc/watch --add  -m /root/.kube/ -t configmap --configmap-name=kubeconfig
```
