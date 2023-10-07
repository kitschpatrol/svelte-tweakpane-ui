<script lang="ts">
	interface FixedProps {
		iAmAFixedProp: boolean;
		/** Pick a mode */
		mode: 'fixed';
	}

	interface DraggableProps {
		iAmADraggableProp: boolean;
		/** Pick a mode */
		mode: 'draggable';
	}

	interface InlineProps {
		iAmAInlineProp?: boolean | undefined;
		/** Pick a mode */
		mode: 'inline';
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = (FixedProps | DraggableProps | InlineProps) & {
		/** Pick a mode */
		mode: 'fixed' | 'draggable' | 'inline';
	};

	let iAmAFixedProp: FixedProps['iAmAFixedProp'] = $$props.iAmAFixedProp;
	let iAmADraggableProp: boolean = $$props.iAmADraggableProp;

	/** Pick a mode */
	export let mode = $$props.mode ?? 'fixed';
	let iAmAInlineProp = $$props.iAmAInlineProp ?? undefined;
</script>

<!-- HTML -->

{mode}
{iAmAFixedProp}
{iAmADraggableProp}
