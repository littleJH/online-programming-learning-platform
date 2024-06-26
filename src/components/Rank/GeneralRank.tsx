import { Button, Card, List, Popover, Skeleton, theme } from 'antd'
import React from 'react'
import style from './style.module.scss'
import MySvgIcon from '../Icon/MySvgIcon'

interface IProps {
  rankList: {
    id: string
    title: React.ReactNode
    score: number
  }[]
  title?: string
  icon?: React.ReactNode
  onClick: (index: number) => void
  extra?: React.ReactNode
  hideIndex?: boolean
  popContent?: (id: string) => React.ReactNode
}

const GeneralRank: React.FC<IProps> = (props) => {
  const { rankList, onClick, title, icon, extra, hideIndex, popContent } = props
  const { token } = theme.useToken()
  return (
    <Card
      size="small"
      className={style.hotRank}
      title={
        <div className="flex items-center">
          <span>{title || '热榜'}</span>
          <span>{typeof icon === 'string' ? <MySvgIcon href="#icon-fire" size={1.5}></MySvgIcon> : icon}</span>
        </div>
      }
      extra={extra}
    >
      {rankList.length === 0 ? (
        <Skeleton active paragraph={{ rows: 9 }} className="px-4"></Skeleton>
      ) : (
        <List
          className={style.hotrank}
          size="small"
          split={false}
          dataSource={rankList}
          renderItem={(item, index) => (
            <List.Item
              key={item.id}
              style={{
                padding: '0px',
              }}
              className={style.item}
              onClick={() => onClick(index)}
            >
              <div className="flex items-center w-full">
                {!hideIndex && (
                  <span className="w-8 mr-4 flex justify-center items-center">
                    {index <= 2 ? (
                      <svg className="icon">
                        <use
                          href={
                            index === 0
                              ? '#icon-top-one'
                              : index === 1
                                ? '#icon-top-two'
                                : index === 2
                                  ? '#icon-top-three'
                                  : ''
                          }
                        ></use>
                      </svg>
                    ) : (
                      <span
                        className="rounded-full h-6 w-6 flex justify-center items-center"
                        style={{
                          backgroundColor: token.colorPrimaryBg,
                          color: token.colorTextSecondary,
                        }}
                      >
                        {index + 1}
                      </span>
                    )}
                  </span>
                )}
                <span className={style.title}>{item.title}</span>
                <span className="flex items-center justify-center ml-4">
                  <span>{typeof icon === 'string' ? <MySvgIcon href="#icon-fire" size={1}></MySvgIcon> : icon}</span>
                  <span className="text-right text-xs">{item.score}</span>
                </span>
              </div>
            </List.Item>
          )}
        ></List>
      )}
    </Card>
  )
}

export default GeneralRank
