<script lang="ts">
	type V = $$Generic<any>;

	interface FixedProps {
		regular: number;
		iAmAFixedProp: boolean;
		/** Pick a mode */
		mode?: 'fixed';
	}

	interface DraggableProps {
		regular: number;
		iAmADraggableProp: boolean;
		/** Pick a mode */
		mode: 'draggable';
	}

	interface InlineProps {
		regular: number;
		iAmAInlineProp?: boolean | undefined;
		/** Pick a mode */
		mode: 'inline';
	}

	type ModeToProps<T> = T extends 'fixed' | undefined | object
		? FixedProps
		: T extends 'draggable'
		? DraggableProps
		: T extends 'inline'
		? InlineProps
		: never;

	type DefaultToFixedProps<T> = T extends undefined ? FixedProps : ModeToProps<T>;

	type $$Props = DefaultToFixedProps<V>;

	// // eslint-disable-next-line @typescript-eslint/no-unused-vars
	// type $$Props = (FixedProps | DraggableProps | InlineProps) & {
	// 	/** Pick a mode */
	// 	mode?: 'fixed' | 'draggable' | 'inline' | undefined;
	// };

	// let iAmAFixedProp: FixedProps['iAmAFixedProp'] = $$props.iAmAFixedProp;
	// let iAmADraggableProp: boolean = $$props.iAmADraggableProp;
	// let iAmAInlineProp = $$props.iAmAInlineProp ?? undefined;

	/** Pick a mode */
	export let mode: V = 'fixed' as V;
</script>

<!-- HTML -->

{mode}
