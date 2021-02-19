import { App } from '/@/App'
import { FileType } from '/@/components/Data/FileType'
import { PackType } from '/@/components/Data/PackType'
import { translate } from '/@/utils/locales'
import { BaseWindow } from '../../BaseWindow'
import {
	ISidebarItemConfig,
	Sidebar,
	SidebarCategory,
	SidebarItem,
} from '../../Layout/Sidebar'
import PackExplorerComponent from './PackExplorer.vue'

class PackSidebarItem extends SidebarItem {
	protected packType: string
	protected kind: 'file' | 'directory'
	constructor(
		config: ISidebarItemConfig & {
			packType: string
			kind: 'file' | 'directory'
		}
	) {
		super(config)
		this.packType = config.packType
		this.kind = config.kind
	}
}

export class PackExplorerWindow extends BaseWindow {
	protected loadedPack = false
	protected sidebarCategory = new SidebarCategory({
		text: 'windows.packExplorer.categories',
		items: [],
	})
	protected sidebar = new Sidebar([this.sidebarCategory])

	constructor() {
		super(PackExplorerComponent, false, true)
		App.eventSystem.on('projectChanged', () => {
			this.sidebar.resetSelected()
			this.loadedPack = false
		})
		this.defineWindow()
	}

	async loadPack() {
		this.sidebarCategory.removeItems()
		let items: SidebarItem[] = []

		const app = await App.getApp()
		const dirents = (await app.project?.packIndexer.readdir([])) ?? []

		dirents.forEach(({ kind, displayName, name, path }: any) => {
			const fileType = FileType.get(undefined, name)
			const packType = fileType
				? PackType.get(
						`projects/test/${
							typeof fileType.matcher === 'string'
								? fileType.matcher
								: fileType.matcher[0]
						}`
				  )
				: undefined
			const icon =
				fileType && fileType.icon
					? fileType.icon
					: `mdi-${kind === 'directory' ? 'folder' : 'file'}-outline`
			const text =
				displayName ?? app.locales.translate(`fileType.${name}`)
			const color = packType ? packType.color : undefined

			items.push(
				new PackSidebarItem({
					kind,
					packType: packType ? packType.id : 'unknown',
					id: path ?? name,
					text,

					icon,
					color,
				})
			)

			this.sidebar.setState(path ?? name, {
				text,
				icon,
				color,
			})
		})

		items = items.sort((a: any, b: any) => {
			if (a.packType !== b.packType)
				return a.packType.localeCompare(b.packType)
			return a.text.localeCompare(b.text)
		})

		items.forEach(item => this.sidebarCategory.addItem(item))
		this.sidebar.setDefaultSelected()

		super.open()
	}

	async open() {
		if (this.loadedPack) super.open()
		else {
			const app = await App.getApp()
			app.project?.packIndexer.once(async () => {
				app.windows.loadingWindow.open()

				await this.loadPack()

				app.windows.loadingWindow.close()
			})
		}
	}
}