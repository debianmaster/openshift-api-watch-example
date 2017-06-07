# openshift-client-scratch

Example using kubernetes-client to implement an OpenShift client.

## Using

```sh
oc adm policy add-scc-to-user anyuid -z default
cp ~/.kube/config config
oc create cm kubeconfig --from-file=config
oc volume dc/watch --add  -m /root/.kube/ -t configmap --configmap-name=kubeconfig


oc new-app https://github.com/debianmaster/openshift-api-watch-example --name=watch
oc new-build https://github.com/debianmaster/simple-scoreboard --name=dash
oc patch dc watch --patch='
{ "spec": { 
    "template": {
      "spec": {
        "containers": [
          { "name" : "dash", 
            "image": "172.30.1.1:5000/dev/dash:latest"
          }
        ], 
        "triggers": [
          { "type": "ImageChange", 
            "imageChangeParams": { 
              "from": { 
                "kind": "ImageStreamTag",
                "name": "dash:latest"
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
```
