import { translateApi } from '@/api/translator'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import ReadOnly from '@/components/editor/Readonly'
import { ICaseSample, IProblem } from '@/type'
import { Card, Divider, Space, Table, theme } from 'antd'
import React, { useMemo, useRef, useState } from 'react'
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons'
import style from '../style.module.scss'
import Column from 'antd/es/table/Column'
import { UpOutlined, DownOutlined } from '@ant-design/icons'
import utils from '@/tool/myUtils/utils'
import { Button } from 'antd'
import { useRecoilValue } from 'recoil'
import { isMobileAtom } from '@/store/appStore'
const ctnClassname = 'py-4'
const roClassname = ''
const titleClassname = 'font-semibold'

const ProblemDetail: React.FC<{ mode?: 'problem' | 'competition'; problem: IProblem; caseSamples: ICaseSample[] }> = (
  props
) => {
  const isMobile = useRecoilValue(isMobileAtom)
  const { mode = 'problem', problem, caseSamples } = props
  const [translateResult, setTranslateResult] = useState('')
  const [translating, setTranslating] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)
  const { token } = theme.useToken()
  const [fetchDone, setfetchDone] = useState(false)
  const [mouseoverLike, setmouseoverLike] = useState(false)
  const [showDetail, setShowDetail] = useState(true)

  const caseSamplesDataSource = useMemo(() => {
    const list: any[] = []
    caseSamples?.forEach((item, index) => {
      list.push({
        key: String(Math.random() * 10000),
        input: item.input,
        output: item.output,
      })
    })
    return list
  }, [caseSamples])

  const translate = async (text: string) => {
    setTranslating(true)
    const res = await translateApi(text)
    if (res.data.code === 200) {
      setTranslateResult(res.data.data.text)
      setTimeout(() => {
        setTranslating(false)
        resultRef.current && resultRef.current.scrollIntoView({ behavior: 'smooth' })
      }, 1)
    }
  }

  return (
    <div className={style.problemDetail}>
      {problem && (
        <>
          {mode === 'problem' && (
            <div className={style.header}>
              {isMobile && (
                <div onClick={() => setShowDetail((val) => !val)} className={style.collapse}>
                  <Button type="dashed" size="small">
                    {showDetail ? (
                      <span>
                        收起
                        <UpOutlined />
                      </span>
                    ) : (
                      <span>
                        展开
                        <DownOutlined />
                      </span>
                    )}
                  </Button>
                </div>
              )}
              <h3>{problem.title}</h3>
              <div className={style.subTitle}>
                <Space className={style.number} split={<Divider type="vertical"></Divider>}>
                  <div
                    className={style.item}
                    onMouseOver={() => setmouseoverLike(true)}
                    onMouseLeave={() => setmouseoverLike(false)}
                  >
                    <span>点赞&nbsp;</span>
                    <span>{problem.likeNum}</span>
                  </div>
                  <div className={style.item}>
                    <span>点踩&nbsp;</span>
                    <span>{problem.dislikeNum}</span>
                  </div>
                  <div className={style.item}>
                    <span>收藏&nbsp;</span>
                    <span>{problem.collectNum}</span>
                  </div>
                  <div className={style.item}>
                    <span>浏览&nbsp;</span>
                    <span>{problem.visibleNum}</span>
                  </div>
                </Space>
                <div className={style.createTime}>
                  <span>{problem.created_at}</span>
                </div>
              </div>
              <Divider
                style={{
                  margin: '1rem 0',
                }}
              ></Divider>
            </div>
          )}
          {showDetail && (
            <div>
              <ReadOnly
                ctnClassName={ctnClassname}
                className={roClassname}
                title={
                  <div className={`${titleClassname} flex justify-between`}>
                    <span>题目描述</span>
                    {!translating && (
                      <span onClick={() => translate(problem.description)} className="cursor-pointer">
                        <MySvgIcon size={1.5} href="fanyi"></MySvgIcon>
                      </span>
                    )}
                    {translating && <LoadingOutlined />}
                  </div>
                }
                html={problem?.description}
              ></ReadOnly>
              {translateResult && (
                <div className="py-4" ref={resultRef}>
                  <Card
                    title={'题目描述'}
                    extra={<CloseOutlined onClick={() => setTranslateResult('')} />}
                    size="small"
                    className={style.translateResult}
                    style={{
                      backgroundColor: token.colorInfoBg,
                    }}
                  >
                    <ReadOnly html={translateResult}></ReadOnly>
                  </Card>
                </div>
              )}

              <ReadOnly
                className={roClassname}
                ctnClassName={ctnClassname}
                title={<div className={titleClassname}>输入格式</div>}
                html={problem?.input}
              ></ReadOnly>
              <ReadOnly
                className={roClassname}
                ctnClassName={ctnClassname}
                title={<div className={titleClassname}>输出格式</div>}
                html={problem?.output}
              ></ReadOnly>
              <div className={ctnClassname}>
                <div className="font-bold">示例</div>
                <Table size="small" className="m-4 " bordered dataSource={caseSamplesDataSource} pagination={false}>
                  <Column
                    title="input"
                    key="input"
                    dataIndex={'input'}
                    render={(value) => {
                      return <div className="mx-4 min-w-max ">{value}</div>
                    }}
                  ></Column>
                  <Column
                    title="output"
                    key="output"
                    dataIndex={'output'}
                    render={(value) => {
                      return <div className="mx-4 min-w-max ">{value}</div>
                    }}
                  ></Column>
                </Table>
              </div>
              <ReadOnly
                className={roClassname}
                ctnClassName={ctnClassname}
                title={<div className={titleClassname}>时间限制</div>}
                html={`${problem?.time_limit} ms`}
              ></ReadOnly>
              <ReadOnly
                className={roClassname}
                ctnClassName={ctnClassname}
                title={<div className={titleClassname}>空间限制</div>}
                html={`${problem?.memory_limit} kb`}
              ></ReadOnly>
              <ReadOnly
                className={roClassname}
                ctnClassName={ctnClassname}
                title={<div className={titleClassname}>提示</div>}
                html={problem?.hint}
              ></ReadOnly>
              <ReadOnly
                className={roClassname}
                ctnClassName={ctnClassname}
                title={<div className={titleClassname}>来源</div>}
                html={problem?.source}
              ></ReadOnly>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProblemDetail
