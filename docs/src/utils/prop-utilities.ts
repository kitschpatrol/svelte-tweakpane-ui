/* eslint-disable max-depth */
import type { StarlightRouteData } from '@astrojs/starlight/route-data'
export type ComponentData = StarlightRouteData['entry']['data']['componentData']
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
	const filteredProps = dynamicProps.filter((dynamicProp) =>
		commonProps.every((commonProp) => dynamicProp.name !== commonProp.name),
	)
	return filteredProps
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
		const collectedProps = [...data.props]
		if (data.dynamicProps) {
			for (const dynamicProp of data.dynamicProps) {
				for (const prop of dynamicProp.props) {
					// Ensure unique
					const alreadyPresent = collectedProps.some((p) => p.name === prop.name)
					if (!alreadyPresent) {
						collectedProps.push(prop)
					}
				}
			}
		}

		return collectedProps
	}

	return []
}
