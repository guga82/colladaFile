const fs = require("fs");

// Função para criar o conteúdo do arquivo COLLADA com uma nuvem de pontos
function createColladaPointCloud(positions) {
  const xml = `
        <?xml version="1.0" encoding="utf-8"?>
        <COLLADA xmlns="http://www.collada.org/2005/11/COLLADASchema" version="1.4.1">
            <asset>
                <contributor>
                    <author>Seu Nome</author>
                </contributor>
                <created>YYYY-MM-DDTHH:MM:SSZ</created>
                <modified>YYYY-MM-DDTHH:MM:SSZ</modified>
                <unit name="meter" meter="1"/>
                <up_axis>Z_UP</up_axis>
            </asset>
            <library_geometries>
                <geometry id="pointCloud">
                    <mesh>
                        <source id="positions">
                            <float_array id="positions_array" count="${
                              positions.length
                            }">${positions.join(" ")}</float_array>
                            <technique_common>
                                <accessor source="#positions_array" count="${
                                  positions.length / 3
                                }" stride="3">
                                    <param name="X" type="float"/>
                                    <param name="Y" type="float"/>
                                    <param name="Z" type="float"/>
                                </accessor>
                            </technique_common>
                        </source>
                        <vertices id="vertices">
                            <input semantic="POSITION" source="#positions"/>
                        </vertices>
                        <lines count="${positions.length / 6}">
                            <input semantic="VERTEX" source="#vertices" offset="0"/>
                            <p>${generateIndices(positions.length)}</p>
                        </lines>
                    </mesh>
                </geometry>
            </library_geometries>
            <library_visual_scenes>
                <visual_scene id="Scene" name="Scene">
                    <node id="PointCloud" name="PointCloud">
                        <instance_geometry url="#pointCloud"/>
                    </node>
                </visual_scene>
            </library_visual_scenes>
            <scene>
                <instance_visual_scene url="#Scene"/>
            </scene>
        </COLLADA>
    `;
  return xml;
}

// function createColladaPointCloud(positions, maxPointsPerUnit) {
//     // Função auxiliar para gerar os índices
//     function generateIndices(length) {
//       const indices = [];
//       for (let i = 0; i < length / 3; i += 2) {
//         indices.push(`${i} ${i + 1}`);
//       }
//       return indices.join(" ");
//     }
  
//     const xmlHeader = `<?xml version="1.0" encoding="utf-8"?>`;
//     const xmlColladaStart = `<COLLADA xmlns="http://www.collada.org/2005/11/COLLADASchema" version="1.4.1">`;
//     const xmlColladaEnd = `</COLLADA>`;
  
//     // Dividir os pontos em unidades menores
//     const units = [];
//     for (let i = 0; i < positions.length; i += maxPointsPerUnit * 3) {
//       const unitPositions = positions.slice(i, i + maxPointsPerUnit * 3);
//       units.push(unitPositions);
//     }
  
//     // Criar XML para cada unidade
//     const unitXMLs = units.map((unitPositions, index) => {
//       return `
//         <geometry id="pointCloud_${index}">
//           <mesh>
//             <source id="positions_${index}">
//               <float_array id="positions_array_${index}" count="${unitPositions.length}">
//                 ${unitPositions.join(" ")}
//               </float_array>
//               <technique_common>
//                 <accessor source="#positions_array_${index}" count="${unitPositions.length / 3}" stride="3">
//                   <param name="X" type="float"/>
//                   <param name="Y" type="float"/>
//                   <param name="Z" type="float"/>
//                 </accessor>
//               </technique_common>
//             </source>
//             <vertices id="vertices_${index}">
//               <input semantic="POSITION" source="#positions_${index}"/>
//             </vertices>
//             <lines count="${unitPositions.length / 6}">
//               <input semantic="VERTEX" source="#vertices_${index}" offset="0"/>
//               <p>${generateIndices(unitPositions.length)}</p>
//             </lines>
//           </mesh>
//         </geometry>`;
//     });
  
//     // Combinar todas as unidades XML
//     const unitsCombinedXML = unitXMLs.join("");
  
//     // Montar o XML completo
//     const fullXML = `
//       ${xmlHeader}
//       ${xmlColladaStart}
//         <asset>
//           <contributor>
//             <author>Seu Nome</author>
//           </contributor>
//           <created>YYYY-MM-DDTHH:MM:SSZ</created>
//           <modified>YYYY-MM-DDTHH:MM:SSZ</modified>
//           <unit name="meter" meter="1"/>
//           <up_axis>Z_UP</up_axis>
//         </asset>
//         <library_geometries>
//           ${unitsCombinedXML}
//         </library_geometries>
//         <library_visual_scenes>
//           <visual_scene id="Scene" name="Scene">
//             ${units.map((_, index) => `<node id="PointCloud_${index}" name="PointCloud_${index}"><instance_geometry url="#pointCloud_${index}"/></node>`).join("")}
//           </visual_scene>
//         </library_visual_scenes>
//         <scene>
//           <instance_visual_scene url="#Scene"/>
//         </scene>
//       ${xmlColladaEnd}
//     `;
  
//     return fullXML;
//   }
  
  

// Função para gerar os índices das linhas
function generateIndices(positionsCount) {
  const indices = [];
  for (let i = 0; i < positionsCount / 3; i += 2) {
    indices.push(`${i} ${i + 1}`);
  }
  return indices.join(" ");
}

const coordenadas = require("./newCoordinates").pointsCoordinates;
// Coordenadas XYZ da nuvem de pontos
// const positions = [
//     10.0, 10.0, 0.0,
//     10.0, -10.0, 0.0,
//     10.0, -10.0, 10.0,
//     10.0, 10.0, 10.0,
//     -10.0, -10.0, 10.0,
//     -10.0, 10.0, 10.0,
//     -10.0, 10.0, 0.0,
//     -10.0, -10.0, 0.0,
//     10.0, 10.0, 0.0,
//     -10.0, 10.0, 0.0,
//     10.0, 10.0, 10.0,
//     -10.0, 10.0, 10.0,
//     10.0, -10.0, 0.0,
//     -10.0, -10.0, 0.0,
//     10.0, -10.0, 10.0,
//     -10.0, -10.0, 10.0,
// ];

const positions = coordenadas.reduce((acc, cur, index) => {
    if (index > 1) {
      acc.push(coordenadas[index-1].x);
      acc.push(coordenadas[index-1].y);
      acc.push(coordenadas[index-1].z);
    }
  acc.push(cur.x);
  acc.push(cur.y);
  acc.push(cur.z);
  return acc;
}, []);

// Criar o conteúdo do arquivo COLLADA com a nuvem de pontos
const colladaContent = createColladaPointCloud(positions, 12);

// Escrever o conteúdo no arquivo
fs.writeFileSync("nuvem_de_pontos.dae", colladaContent, "utf8");

console.log("Arquivo COLLADA com nuvem de pontos criado com sucesso.");

// const fs = require('fs');

// // Função para criar o conteúdo do arquivo COLLADA
// function createColladaFile(positions) {
//     const xml = `
//         <?xml version="1.0" encoding="utf-8"?>
//         <COLLADA xmlns="http://www.collada.org/2005/11/COLLADASchema" version="1.4.1">
//             <asset>
//                 <contributor>
//                     <author>Seu Nome</author>
//                 </contributor>
//                 <created>YYYY-MM-DDTHH:MM:SSZ</created>
//                 <modified>YYYY-MM-DDTHH:MM:SSZ</modified>
//                 <unit name="meter" meter="1"/>
//                 <up_axis>Z_UP</up_axis>
//             </asset>
//             <library_geometries>
//                 <geometry id="geometry1">
//                     <mesh>
//                         <source id="positions">
//                             <float_array id="positions_array" count="${positions.length}">${positions.join(' ')}</float_array>
//                             <technique_common>
//                                 <accessor source="#positions_array" count="${positions.length / 3}" stride="3">
//                                     <param name="X" type="float"/>
//                                     <param name="Y" type="float"/>
//                                     <param name="Z" type="float"/>
//                                 </accessor>
//                             </technique_common>
//                         </source>
//                         <vertices id="vertices">
//                             <input semantic="POSITION" source="#positions"/>
//                         </vertices>
//                         <triangles count="${positions.length / 9}">
//                             <input semantic="VERTEX" source="#vertices" offset="0"/>
//                             <p>${generateIndices(positions.length)}</p>
//                         </triangles>
//                     </mesh>
//                 </geometry>
//             </library_geometries>
//             <library_visual_scenes>
//                 <visual_scene id="Scene" name="Scene">
//                     <node id="Node" name="Node">
//                         <instance_geometry url="#geometry1"/>
//                     </node>
//                 </visual_scene>
//             </library_visual_scenes>
//             <scene>
//                 <instance_visual_scene url="#Scene"/>
//             </scene>
//         </COLLADA>
//     `;
//     return xml;
// }

// // Função para gerar os índices dos triângulos
// function generateIndices(positionsCount) {
//     const indices = [];
//     for (let i = 0; i < positionsCount / 3; i += 4) {
//         indices.push(`${i} ${i + 1} ${i + 2} ${i} ${i + 2} ${i + 3}`);
//     }
//     return indices.join(' ');
// }

// // Coordenadas XYZ do cubo
// const positions = [
//     1.0, 1.0, 1.0,
//     -1.0, 1.0, 1.0,
//     -1.0, -1.0, 1.0,
//     1.0, -1.0, 1.0
// ];

// // Criar o conteúdo do arquivo COLLADA
// const colladaContent = createColladaFile(positions);

// // Escrever o conteúdo no arquivo
// fs.writeFileSync('meu_arquivo.dae', colladaContent, 'utf8');

// console.log('Arquivo COLLADA criado com sucesso.');
