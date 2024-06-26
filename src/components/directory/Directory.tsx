import React from 'react'
import { Tree } from 'antd'
import { useRecoilState, useRecoilValue } from 'recoil'
import { directoryDataState, directorySelectKeysState } from './store'
import NoData from '../empty/NoData'

const Directory: React.FC = () => {
  const treeData = useRecoilValue(directoryDataState)
  const [directorySelectKeys, setDirectorySelectKeys] = useRecoilState(directorySelectKeysState)

  const handleDirectorySelect = (keys: any) => {
    console.log('handleDirectorySelect ==> ', keys)
    const a = document.createElement('a')

    if (keys.length > 0) {
      setDirectorySelectKeys(keys)
      a.href = `#${keys[0]}`
      a.click()
    } else if (keys.length === 0) {
      a.href = `#${directorySelectKeys[0]}`
      a.click()
      setDirectorySelectKeys(directorySelectKeys)
    }
  }
  return (
    <>
      {treeData.length > 0 && (
        <Tree
          style={{
            minWidth: '18rem',
            height: '100%',
          }}
          treeData={treeData}
          defaultExpandAll={true}
          selectedKeys={directorySelectKeys}
          // titleRender={(node) => (
          //   <div
          //     style={{
          //       width: '14rem',
          //       overflow: 'hidden',
          //       whiteSpace: 'nowrap',
          //       textOverflow: 'ellipsis'
          //     }}
          //   >
          //     {node.title}
          //   </div>
          // )}
          onSelect={handleDirectorySelect}
        ></Tree>
      )}
    </>
  )
}

export default Directory
