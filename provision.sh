oc project default
oc adm policy add-scc-to-user anyuid -z default
oc adm policy add-cluster-role-to-user cluster-admin -z default
export registry=$(oc get svc docker-registry -n default  -o jsonpath='{.spec.clusterIP}')
oc new-build https://github.com/debianmaster/openshift-api-watch-example --name=watch-img
oc new-build https://github.com/debianmaster/simple-scoreboard --name=dash-img
echo "Waiting on build..... 2 min"
sleep 120
oc new-app watch-img --name=watch

oc patch dc watch --patch='
{ "spec": { 
    "template": {
      "spec": {
        "containers": [
          { "name" : "dash", 
            "image": "'${registry}':5000/default/dash-img:latest"
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
oc expose svc watch --port=8080
oc expose svc watch --port=8081 --name=watch-api
open http://$(oc get routes watch -o jsonpath={.spec.host})/
