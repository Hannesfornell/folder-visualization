import './App.css'
import React, { useState } from 'react'
import folderStructure from './folderStructure.json'
import folderImage from './Content/folder.png'
import pngImage from './Content/png.png'
import sampleTxt from './Content/sampleTxt.txt'

function App() {
 let itemTree = [{
  key: 1,
  name: "Root",
  type: "folder",
  children: []
}]
let sampleString = " "
let key = 2

//Reading sample .txt file
fetch(sampleTxt).then((r) => r.text())
.then(text  => {
  sampleString=text
}) 

//Function for determining what type a filename is
const findType = (filename) => {
  if(filename.includes(".png")){
    return "png"
          } 
          else if(filename.includes(".txt")) {
            return "txt"
          }
          else{
            return "folder"
          }
}

//Convert the provided structure to a more usable structure
const changeData = () =>{
  //look at path in the filestructure separatly
  folderStructure.forEach(completePath => {
    //divied path into path nodes
    let pathElements = completePath.split("/")
    let currentNode = itemTree[0]
    pathElements.forEach(pathElement => {
      //check if the path node already has been added to the new structure
      let alreadyAddedUnit = currentNode.children.filter(children => children.name === pathElement)
      //if  not, create a new node and add it to the current nodes children
    if(alreadyAddedUnit.length<1){
      const type = findType(pathElement)
      let newNode = {
        key: key,
        name: pathElement,
        type: type,
        children: []
      }
      currentNode.children.push(newNode)
      currentNode=newNode
      key++
    }else{
      //if node is already in the strucure, move to it without adding it again
      currentNode=alreadyAddedUnit[0]
    }
  })
  })
}

//Tree and treenode is used recurseivly to create the folder structure. Tree creates a new level in the structure and TreeNode displays each element on that level
const Tree = ({ data = [] }) => {
  return (
    <div>
      <ul>
        {data.map((tree) => (
          <TreeNode node={tree} />
        ))}
      </ul>
    </div>
  )
}

const TreeNode = ({ node }) => {

  //Handles state for toggling the visibility of the node
  const [childVisible, setChildVisiblity] = useState(false)
  //Check if a node has children
  const hasChild = node.children ? true : false

  //Displays dummy data given the specific node type. In a real scenario I would save the path in each node object and that way be able to fetch and display the real content here.
  const typeSwitch = (type) => {
    switch(type.type){
      case "folder":
        return <div><img className="iconImage" src={folderImage} />{type.name}</div>
      case "png":
        //Here you would like an onclick function so that the image get displayed in fullsize if clicked
        return <img className="pngImage" src={pngImage}/>
      case "txt":
        return <p>{sampleString}</p>
    }
  }

  return (
    <li>
      <div onClick={(e) => setChildVisiblity((visibility) => !visibility)}>
        {hasChild && (
          <div
            className={`${
              childVisible ? "active" : ""
            }`}
          >
          </div>
        )}

        <div>
          {typeSwitch(node)}
        </div>
      </div>

      {hasChild && childVisible && (
        <div >
          <ul>
            <Tree data={node.children} />
          </ul>
        </div>
      )}
    </li>
  )
}


changeData()
return (
      <div >
        <h2>Visualization of folder structure</h2>
        <span>
              <Tree data={itemTree} />
        </span>
      </div>
)
}
export default App
