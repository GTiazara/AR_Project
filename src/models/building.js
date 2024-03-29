
export function buildingLayer(serverURL, nameType, crs, zoomMinLayer, extent, view) {
    const geometrySource = new itowns.WFSSource({
        url: serverURL,
        typeName: nameType,
        crs: crs,
        extent: extent
    });

    let ListMesh = {};

    let listContaminer = {};



    const geomLayer = new itowns.FeatureGeometryLayer('Buildings', {
        source: geometrySource,
        zoom: { min: zoomMinLayer },
        style: new itowns.Style({
            fill: {
                color: setColor,
                base_altitude: setAltitude,
                extrusion_height: setExtrusion,
            },

        }),
        onMeshCreated: function virusspread(mesh) {
            mesh.children.forEach(c => {

                let geoms = c.children[0].children[0].children[0].feature.geometries



                let count = 0;
                geoms.map(goem => {
                    count++;

                    let id = goem.properties.id;



                    listContaminer[id] = goem.properties



                    if ((count % 70) == 0) {
                        // console.log(goem.properties);

                        // mesh = addMeshToScene((goem.properties.bbox[0] + goem.properties.bbox[2]) / 2, (goem.properties.bbox[1] + goem.properties.bbox[3]) / 2, view);



                        ListMesh[id] = {
                            id: id,
                            batiMesh: c.children[0].children[0].children[0],
                            position: {
                                x: (goem.properties.bbox[0] + goem.properties.bbox[2]) / 2,
                                y: (goem.properties.bbox[1] + goem.properties.bbox[3]) / 2,
                                z: goem.properties.z_min
                            }
                        };


                        { {/*  console.log(mesh)  */ } }

                    }


                })



            })


        },
    });

    // Coloring the data
    function setColor(properties) {
        // console.log(properties)
        // console.log("fsqfsqfsqfqfd")
        // console.log(Object.keys(ListMesh))
        // console.log(Object.keys(ListMesh)[0])
        // console.log(properties.id)
        // console.log(ListMesh)
        const id = properties.id;
        let color = "rgb(255, 255, 255)";
        let i = 0;
        console.log(properties.id)
        console.log(listContaminer)
        console.log(Object.keys(listContaminer).includes(id))
        // Object.keys(ListMesh).forEach(batid => {
        //     i++;
        // }
        console.log(color)

        return new itowns.THREE.Color(color)
    }


    // console.log(listCoords)

    return { layer: geomLayer, coords: ListMesh, bat: listContaminer };
}



// Extruding the data 
function setExtrusion(properties) {
    return properties.hauteur;
}

// Placing the data on the ground
function setAltitude(properties) {
    return properties.z_min - properties.hauteur;
}


/* Properties example:
            geometry_name: "the_geom"
            hauteur: 9
            id: "bati_indifferencie.19138409"
            origin_bat: "Cadastre"
            prec_alti: 5
            prec_plani: 2.5
            z_max: 83.7
            z_min: 83.7
*/


export function addMeshToScene(x, y, z, view) {
    // creation of the new mesh (a cylinder)
    const THREE = itowns.THREE;
    const geometry = new THREE.CylinderGeometry(0, 10, 60, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xffc0cb });
    const mesh = new THREE.Mesh(geometry, material);

    // get the position on the globe, from the camera
    const cameraTargetPosition = view.controls.getLookAtCoordinate();
    // const cameraTargetPosition = new itowns.Coordinates('EPSG:4326', x, y, z *******
    // position of the mesh
    const meshCoord = cameraTargetPosition;
    meshCoord.altitude += 30;

    meshCoord.x = x;
    meshCoord.y = y;

    // position and orientation of the mesh
    mesh.position.copy(meshCoord.as(view.referenceCrs)); // *****
    // mesh.lookAt(new THREE.Vector3(0, 0, 0));
    mesh.rotateX(Math.PI / 2);

    // update coordinate of the mesh
    mesh.updateMatrixWorld(); // *****

    // add the mesh to the scene
    view.scene.add(mesh);

    // make the object usable from outside of the function
    view.mesh = mesh;
    view.notifyChange();

    return mesh
}
