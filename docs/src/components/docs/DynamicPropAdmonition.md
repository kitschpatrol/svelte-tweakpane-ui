:::note[Dynamic Props]
**This component has dynamic props, which means the props available on the component can change depending on the value or type of other props passed to the component.**

The section below lists the props that are always available under "Common Props", and then provides additional prop tables showing how prop availability changes under different circumstances.

Dynamic props are neither particularly well supported by Svelte itself, nor are they a particularly common pattern in Svelte libraries, but they're used in `svelte-tweakpane-ui` to provide flexibility at runtime and reduce the number of discrete components required.

Autocompletion should adapt dynamically to show valid props available at any given time.

You may see warnings if you change a dynamic prop at runtime while continuing to pass props valid only for a different permutation of dynamic props.
:::
