import { DecryptedItem } from '../../Abstract/Item/Implementations/DecryptedItem'
import { PredicateInterface } from '../../Runtime/Predicate/Interface'
import { predicateFromJson } from '../../Runtime/Predicate/Generators'
import { DecryptedPayloadInterface } from '../../Abstract/Payload/Interfaces/DecryptedPayload'
import { SystemViewId } from './SystemViewId'
import { EmojiString, IconType } from '../../Utilities/Icon/IconType'
import { SmartViewDefaultIconName, systemViewIcon } from './SmartViewIcons'
import { SmartViewContent } from './SmartViewContent'

export const SMART_TAG_DSL_PREFIX = '!['

export function isSystemView(view: SmartView): boolean {
  return Object.values(SystemViewId).includes(view.uuid as SystemViewId)
}

export class SmartView extends DecryptedItem<SmartViewContent> {
  public readonly predicate!: PredicateInterface<DecryptedItem>
  public readonly title: string
  public readonly iconString: IconType | EmojiString

  constructor(payload: DecryptedPayloadInterface<SmartViewContent>) {
    super(payload)
    this.title = String(this.content.title || '')

    if (isSystemView(this)) {
      this.iconString = systemViewIcon(this.uuid as SystemViewId)
    } else {
      this.iconString = this.payload.content.iconString || SmartViewDefaultIconName
    }

    try {
      this.predicate = this.content.predicate && predicateFromJson(this.content.predicate)
    } catch (error) {
      console.error(error)
    }
  }
}
