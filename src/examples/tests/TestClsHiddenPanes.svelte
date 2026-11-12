<script lang="ts">
	import { Button, Element, Folder, Pane, Slider, TabGroup, TabPage } from '#lib'
</script>

<!-- Fixed and draggable panes float over the page, so they aren't prerendered -->

<Pane position="fixed" title="Fixed">
	<Slider label="Slider" value={1} />
	<Folder title="Folder">
		<Button title="Button" />
	</Folder>
	<TabGroup>
		<TabPage title="A">
			<Button title="Button" />
		</TabPage>
	</TabGroup>
</Pane>

<Pane title="Draggable">
	<Slider label="Slider" value={1} />
	<Element>
		<p>Element</p>
	</Element>
</Pane>
