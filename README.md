# openshift-client-scratch

Example using kubernetes-client to implement an OpenShift client.

## Using

```sh
oc adm policy add-scc-to-user anyuid -z default
oc adm policy add-cluster-role-to-user cluster-admin -z default
export registry=$(oc get svc docker-registry -n default  -o jsonpath='{.spec.clusterIP}')
oc new-build https://github.com/debianmaster/openshift-api-watch-example --name=watch-img
oc new-build https://github.com/debianmaster/simple-scoreboard --name=dash-img
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
```
