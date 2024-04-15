import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Divider, Popover, Segmented, Select, Space, theme } from 'antd'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { sideBarTypeState, userInfoState } from '@/store/appStore'
import style from './style.module.scss'
import { MessageOutlined, TrophyOutlined, GlobalOutlined, CodeOutlined, StarOutlined } from '@ant-design/icons'
import NavgationCard from '@/components/Card/NavgationCard'
import myHooks from '@/tool/myHooks/myHooks'
import GeneralRank from '@/components/Rank/GeneralRank'
import { getCurrentUserinfo, userRankApis } from '@/api/user'
import { User } from '@/type'
import UserInfo from '@/components/User/UserInfo'
import UserCard from '@/components/User/UserCard'
import MyAvatar from '@/components/Avatar/MyAvatar'
import { ojLanguagesObject } from '@/components/Editor/LanguageList'
import OjPlatform from './components/OjPlatform'

export default function Homepage() {
  const setSidebarType = useSetRecoilState(sideBarTypeState)
  const currentUser = useRecoilValue(userInfoState)
  const [rankList, setRankList] = useState<User[]>([])
  const { token } = theme.useToken()
  const nav = myHooks.useNavTo()

  const datasource = useMemo(
    () =>
      rankList.map((item: User) => ({
        id: item.id,
        title: (
          <Popover
            placement="left"
            content={
              <div
                style={{
                  width: '20rem',
                }}
              >
                <UserInfo user={item}></UserInfo>
              </div>
            }
          >
            <div
              style={{
                padding: '0.5rem 0',
              }}
            >
              <Space>
                <span>
                  <MyAvatar user={item}></MyAvatar>
                </span>
                <span>{item.name}</span>
              </Space>
            </div>
          </Popover>
        ),
        score: item.score || 0,
      })),
    [rankList]
  )

  useEffect(() => {
    setSidebarType('none')
    fetchRankList('Hot')
  }, [])

  const fetchRankList = async (type: string) => {
    try {
      const api = userRankApis[`get${type}RankApi`]
      const res = await api()
      setRankList(res.data.data.users || [])
    } catch {}
  }

  const handleSelectChange = (value: string) => {
    fetchRankList(value)
  }

  const navItems = [
    {
      title: '在线评测',
      content: '挑战自己，提升编程技能',
      icon: (
        <CodeOutlined
          style={{
            color: token.colorPrimary,
            fontSize: '2rem',
          }}
        />
      ),
      path: '/problemset/all',
    },
    {
      title: '竞赛切磋',
      content: '参与竞赛，展示你的实力',
      icon: (
        <TrophyOutlined
          style={{
            color: token.colorPrimary,
            fontSize: '2rem',
          }}
        />
      ),
      path: '/competition/common/set',
    },
    {
      title: '即时通讯',
      content: '与志同道合的编程爱好者交流',
      icon: (
        <MessageOutlined
          style={{
            color: token.colorPrimary,
            fontSize: '2rem',
          }}
        />
      ),
      path: '/profile/group',
    },
    {
      title: '知识分享',
      content: '分享经验，造福他人',
      icon: (
        <GlobalOutlined
          style={{
            color: token.colorPrimary,
            fontSize: '2rem',
          }}
        />
      ),
      path: '/community/articleset',
    },
  ]
  return (
    <div className={style.homeRoot}>
      <div className={style.left}>
        <header className={style.header}>
          <h1>DOJ - 编程学习平台</h1>
          <p>解锁编程的奥秘，与世界分享你的想法</p>
          <img></img>
        </header>

        <section className="w-full">
          {/* 导航 */}
          <div className={style.navCard}>
            {navItems.map((item, index) => (
              <div key={index} className={style.item}>
                <NavgationCard
                  title={item.title}
                  content={item.content}
                  icon={item.icon}
                  path={item.path}
                ></NavgationCard>
              </div>
            ))}
          </div>
          {/* 支持的语言 */}
          <div className={style.languages}>
            {ojLanguagesObject['defaultLanguageList'].map((item: any, index: number) => (
              <span key={index}>{item.label}</span>
            ))}
          </div>
          {/* 支持的oj平台 */}
          <div className={style.ojPlatform}>
            <OjPlatform></OjPlatform>
          </div>
        </section>
        <footer></footer>
      </div>
      <div className={style.right}>
        <div className={style.rankBox}>
          <GeneralRank
            title="今日排行"
            rankList={datasource}
            // extra={<Segmented options={['']}></Segmented>}
            icon={<StarOutlined style={{ color: '#fadb14', marginRight: '4px' }} />}
            onClick={() => {}}
            extra={
              <Select
                size="small"
                variant={'filled'}
                style={{
                  fontSize: '0.75rem',
                  width: '7rem',
                }}
                defaultValue={'Hot'}
                onChange={handleSelectChange}
                options={[
                  {
                    label: '热度',
                    value: 'Hot',
                  },
                  {
                    label: '竞赛分',
                    value: 'Score',
                  },
                  {
                    label: '点赞',
                    value: 'Like',
                  },
                  {
                    label: '收藏',
                    value: 'Collect',
                  },
                  {
                    label: 'AC',
                    value: 'Ac',
                  },
                  {
                    label: '访问量',
                    value: 'Visit',
                  },
                ]}
              ></Select>
            }
          ></GeneralRank>
        </div>
      </div>
    </div>
  )
}
