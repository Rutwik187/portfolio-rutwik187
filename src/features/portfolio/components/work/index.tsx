import { WORK } from "../../data/work"
import {
  Panel,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "../panel"
import { PanelTitleCopy } from "../panel-title-copy"
import { WorkList } from "./work-list"

const ID = "work"

export function Work() {
  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Selected work</a>
          <PanelTitleSup>({WORK.length})</PanelTitleSup>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
        <PanelDescription>
          Client products I built and shipped. Open one for screenshots and how
          it works.
        </PanelDescription>
      </PanelHeader>

      <WorkList />
    </Panel>
  )
}
