/* eslint-disable max-depth */
import type { Props as StarlightProps } from '@astrojs/starlight/props'
export type ComponentData = StarlightProps['entry']['data']['componentData']
export type ComponentProp = NonNullable<ComponentData>['props'][number]
export type Condition = Omit<
	NonNullable<NonNullable<ComponentData>['dynamicProps']>[number],
	'props'
>
export type ConditionsRecord = Record<string, Condition[]>

export function uniqueProps(
	commonProps: ComponentProp[],
	dynamicProps: ComponentProp[],
): ComponentProp[] {
	const uniqueProps = dynamicProps.filter(
		(dynamicProp) => !commonProps.some((commonProp) => dynamicProp.name === commonProp.name),
	)
	return uniqueProps
}

export function allPropConditions(data: ComponentData): ConditionsRecord {
	if (data?.dynamicProps) {
		const conditionsRecord: ConditionsRecord = {}

		for (const dynamicProp of data.dynamicProps) {
			const unique = uniqueProps(data.props, dynamicProp.props)

			for (const prop of unique) {
				// Ensure unique
				conditionsRecord[prop.name] ??= []

				conditionsRecord[prop.name].push({
					condition: dynamicProp.condition,
					description: dynamicProp.description,
				})
			}
		}

		return conditionsRecord
	}

	return {}
}

export function allProps(data: ComponentData): ComponentProp[] {
	if (data) {
		const allProps = [...data.props]
		if (data.dynamicProps)
			for (const dynamicProp of data.dynamicProps) {
				for (const prop of dynamicProp.props) {
					// Ensure unique
					const existingProp = allProps.find((p) => p.name === prop.name)
					if (!existingProp) {
						allProps.push(prop)
					}
				}
			}

		return allProps
	}

	return []
}
