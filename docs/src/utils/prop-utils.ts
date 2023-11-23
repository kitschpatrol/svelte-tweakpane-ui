import type { Props as StarlightProps } from '@astrojs/starlight/props';
export type ComponentData = StarlightProps['entry']['data']['componentData'];
export type ComponentProp = NonNullable<ComponentData>['props'][number];
export type Condition = NonNullable<
	NonNullable<ComponentData>['dynamicProps']
>[number]['condition'];
export type ConditionsRecord = Record<string, Condition[]>;

export function uniqueProps(
	commonProps: ComponentProp[],
	dynamicProps: ComponentProp[]
): ComponentProp[] {
	const uniqueProps = dynamicProps.filter((dynamicProp) => {
		return !commonProps.find((commonProp) => {
			return dynamicProp.name === commonProp.name;
		});
	});
	return uniqueProps;
}

export function allPropConditions(data: ComponentData): ConditionsRecord {
	if (data && data.dynamicProps) {
		const conditionsRecord: ConditionsRecord = {};

		data.dynamicProps?.forEach((dynamicProp) => {
			const unique = uniqueProps(data.props, dynamicProp.props);

			unique.forEach((prop) => {
				// ensure unique
				if (conditionsRecord[prop.name] === undefined) {
					conditionsRecord[prop.name] = [];
				}

				conditionsRecord[prop.name].push(dynamicProp.condition);
			});
		});

		return conditionsRecord;
	}
	return {};
}

export function allProps(data: ComponentData): ComponentProp[] {
	if (data) {
		const allProps = [...data.props];
		data.dynamicProps?.forEach((dynamicProp) => {
			dynamicProp.props.forEach((prop) => {
				// ensure unique
				const existingProp = allProps.find((p) => p.name === prop.name);
				if (!existingProp) {
					allProps.push(prop);
				}
			});
		});

		return allProps;
	}
	return [];
}
