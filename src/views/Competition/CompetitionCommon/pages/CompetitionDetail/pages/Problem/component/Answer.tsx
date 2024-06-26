import React, { useEffect, useState, Fragment, useMemo, useRef } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { getProblemNewApi } from '@/api/problemNew'
import {
  IProblem,
  ICaseSample,
  // IEditorConfig,
  IRunResult,
  IRecordState,
  CompetitionType,
} from '@/type'
import ReadOnly from '@/components/editor/Readonly'
import { Button, Menu, Popover, Segmented, Switch, Table } from 'antd'
import Column from 'antd/es/table/Column'
import CodeEditor from '@/components/Editor/CodeEditor'
import { languageList } from '@/components/Editor/LanguageList'
import RunResult from '@/views/Problem/RunResult'
import TextArea from 'antd/es/input/TextArea'
import { createTestApi } from '@/api/test'
import { createRecordApi } from '@/api/competitionMixture'
import { useRecoilValue } from 'recoil'
import { isMobileAtom, notificationApi } from '@/store/appStore'
import { currentCompetitionAtom } from '@/views/Competition/competitionStore'
import Description from '@/views/Problem/pages/Description'
import ProblemDetail from '@/components/Problem/Detail/ProblemDetail'
import style from '../../../../../../style.module.scss'
import utils from '@/tool/myUtils/utils'
export interface ChangeOptions {
  code: string
  runResult: IRunResult
  currentState: IRecordState
}

interface IProps {
  problem_id: string
  onStateChange: (options: ChangeOptions) => void
  onSubmited: (id: string) => void
}

const initTestState: IRecordState = {
  value: '',
  label: '待运行',
  state: 'info',
}

const Answer: React.FC<IProps> = (props) => {
  const isMobile = useRecoilValue(isMobileAtom)
  const nav = useNavigate()
  const competition = useRecoilValue(currentCompetitionAtom)
  const { problem_id, onStateChange, onSubmited } = props
  const [problem, setproblem] = useState<IProblem>()
  const [caseSamples, setcaseSamples] = useState<ICaseSample[]>([])
  const [code, setcode] = useState<string>('')
  const [openLanguageList, setopenLanguageList] = useState(false)
  const [showConsole, setshowConsole] = useState(false)
  const [consoleMode, setconsoleMode] = useState('test')
  const [testTextareaValue, settestTextareaValue] = useState<string>('')
  const [runResult, setrunResult] = useState<IRunResult>({} as IRunResult)
  const [currentState, setcurrentState] = useState<IRecordState>(initTestState)
  const notification = useRecoilValue(notificationApi)
  const footerRef = useRef<HTMLDivElement>(null)
  // const [editorConfig, setEditorConfig] = useState<IEditorConfig>({
  //   language: '',
  //   theme: 'vs-dark'
  // })

  // const currentLang: React.ReactNode = useMemo(() => {
  //   let element: JSX.Element = <div></div>
  //   languageList.forEach((value) => {
  //     if (value.value === editorConfig.language) element = value.label
  //   })
  //   return element
  // }, [editorConfig])

  useEffect(() => {
    fetch()
    window.addEventListener('resize', () => {})
  }, [])

  useEffect(() => {
    onStateChange({
      code,
      runResult,
      currentState,
    })
  }, [code, runResult, currentState])

  // useEffect(() => {
  //   localStorage.setItem('editorConfig', JSON.stringify(editorConfig))
  // }, [editorConfig])

  const fetch = async () => {
    setcode(localStorage.getItem(`code-${problem_id}`) || '')
    const res = await getProblemNewApi(problem_id as string)
    setproblem(res.data.data.problem)
    settestTextareaValue(res.data.data.caseSamples[0]?.input)
    const caseSamples = res.data.data.caseSamples.map((item: ICaseSample) => {
      return {
        ...item,
        key: String(item.cid),
      }
    })
    setcaseSamples(caseSamples)
  }

  const runCode = () => {
    setcurrentState({
      value: 'Running',
      label: '运行中',
      state: 'info',
    })
    setshowConsole(true)
    setconsoleMode('result')

    const data = {
      language: 'C++11',
      code: code,
      input: testTextareaValue,
      time_limit: problem?.time_limit,
      memory_limit: problem?.memory_limit,
    }
    createTestApi(JSON.stringify(data)).then((res) => {
      setrunResult(res.data.data)
    })
  }
  const craeteRecord = async () => {
    if (!competition) return
    const data = {
      language: 'C++11',
      code: code,
      problem_id: problem_id,
    }
    try {
      const res = await createRecordApi(competition.type, competition.id, JSON.stringify(data))
      console.log(res.data)
      if (res.data.code !== 200 || res.data.msg === '未报名') {
        notification &&
          notification.error({
            message: res.data.msg,
          })
        // nav(`/competition/${competition.id}/record`)
      } else {
        onSubmited(problem_id)
        notification &&
          notification.success({
            message: res.data.msg,
          })
      }
    } catch {}
  }

  const scrollToEnd = () => {
    setTimeout(() => {
      footerRef.current && footerRef.current.scrollIntoView({ behavior: 'smooth' })
    }, 0)
  }

  return (
    <div className={style.answer}>
      {/* description */}
      {problem && <ProblemDetail mode={'competition'} problem={problem} caseSamples={caseSamples}></ProblemDetail>}

      {/* editor */}
      {/* <div className='shadow'> */}
      {/* <div className={'bg-slate-100 p-2 flex items-center justify-between '}>
          <Popover
            style={{
              width: '4rem',
              padding: '0'
            }}
            trigger='click'
            open={openLanguageList}
            content={languageList.map((value: any, index: number) => {
              return (
                <div
                  className='px-2 hover:cursor-pointer hover:shadow rounded flex items-center justify-start'
                  onClick={() => {
                    setopenLanguageList(false)
                    setEditorConfig((value) => {
                      return {
                        theme: value.theme,
                        language: languageList[index].value
                      }
                    })
                  }}
                >
                  <span>{value.label}</span>
                  <span className='px-2'> {value.value}</span>
                </div>
              )
            })}
          >
            <div
              onClick={() => setopenLanguageList(true)}
              className='hover:cursor-pointer hover:shadow flex justify-center items-center px-2 rounded'
            >
              <span>{currentLang}</span>
            </div>
          </Popover>
          <div>
            <svg
              className='icon hover:cursor-pointer '
              onClick={() => {
                setEditorConfig((value) => {
                  return {
                    theme: value.theme === 'light' ? 'vs-dark' : 'light',
                    language: value.language
                  }
                })
              }}
            >
              {editorConfig.theme === 'light' ? <use href='#icon-light'></use> : <use href='#icon-dark'></use>}
            </svg>
          </div>
        </div> */}
      {/* <h4>作答</h4> */}
      <div className="pt-4">
        <CodeEditor
          value={code}
          height={isMobile ? 300 : 500}
          codeChange={(value: string) => {
            localStorage.setItem(`code-${problem_id}`, value)
            setcode(value)
          }}
        ></CodeEditor>
      </div>
      {/* </div> */}
      {/* footer */}
      <div className="flex items-center py-1">
        {/* <div className="flex-grow flex items-center">
          <Switch
            checked={switchChecked}
            onChange={value => setswitchChecked(value)}
          ></Switch>
          <span>自定义测试用例</span>
        </div> */}
        <div className="flex-grow my-4" onClick={scrollToEnd}>
          <Switch
            checkedChildren={'控制台'}
            unCheckedChildren={'控制台'}
            checked={showConsole}
            onChange={(value) => setshowConsole(value)}
          ></Switch>
        </div>
        <div className="">
          <Button
            size="small"
            onClick={() => {
              runCode()
              scrollToEnd()
            }}
          >
            执行代码
          </Button>
          <Button size="small" onClick={craeteRecord} className="mx-1" type="primary">
            提交
          </Button>
        </div>
      </div>
      {/* console */}
      {showConsole && (
        <div className=" border border-solid border-slate-300 rounded">
          <Menu
            selectedKeys={[consoleMode]}
            style={{
              padding: '0',
              height: '3rem',
            }}
            mode="horizontal"
            items={[
              {
                label: '测试用例',
                key: 'test',
              },
              {
                label: '执行结果',
                key: 'result',
              },
            ]}
            onClick={(e) => {
              setconsoleMode(e.key)
              scrollToEnd()
            }}
          ></Menu>
          <div className="w-full">
            <div className="p-4">
              {consoleMode === 'test' && (
                <TextArea
                  value={testTextareaValue}
                  autoSize={{
                    minRows: 3,
                  }}
                  onChange={(e) => settestTextareaValue(e.target.value)}
                ></TextArea>
              )}
              {consoleMode === 'result' && (
                <RunResult
                  caseSample={{
                    input: testTextareaValue,
                    output: caseSamples[0]?.output,
                  }}
                  runResult={runResult}
                  currentState={currentState}
                  setcurrentState={setcurrentState}
                ></RunResult>
              )}
            </div>
          </div>
        </div>
      )}
      <div ref={footerRef}></div>
    </div>
  )
}

export default Answer
