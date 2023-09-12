export type Entity = number;

export interface Component {
  type: string;
}

export interface ComponentWithEntity {
  type: string;
  entity: Entity;
}

export type System<T> = (state: T) => void;

export class Ecs {
  private seq = 0;
  private componentsByType = new Map<string, Array<Component>>();
  private componentsByEntity = new Map<Entity, Array<Component>>();
  private globals = new Map<string, unknown>();

  createEntity() {
    return this.seq++;
  }

  createEntityFromPrefab(prefab: any) {
    const entity = this.createEntity();
    this.addComponents(entity, ...structuredClone(prefab));
    return entity;
  }

  removeEntity(entity: Entity) {
    this.getComponentsByEntity(entity).forEach((component) => {
      const components = this.getComponentsByType(component.type);
      this.componentsByType.set(
        component.type,
        components.filter((c) => c.entity !== entity),
      );
    });
  }

  addComponent<T extends Component>(entity: Entity, component: T) {
    this.addComponentByType(component);
    this.addComponentByEntity(entity, component);
  }

  removeComponent<T extends Component>(entity: Entity, component: T) {
    this.removeComponentByType(component);
    this.removeComponentByEntity(entity, component);
  }

  addComponents(entity: Entity, ...components: any[]) {
    for (const component of components) {
      this.addComponent(entity, component);
    }
  }

  getComponent<T extends Component>(
    entity: Entity,
    type: string,
  ): (T & ComponentWithEntity) | undefined {
    return this.componentsByEntity.get(entity)?.find((c) => c.type === type) as T &
      ComponentWithEntity;
  }

  private addComponentByType(component: Component) {
    const components = this.componentsByType.get(component.type);
    if (!components) {
      this.componentsByType.set(component.type, [component]);
    } else {
      components.push(component);
    }
  }

  private addComponentByEntity(entity: number, component: Component) {
    (component as ComponentWithEntity).entity = entity;
    const components = this.componentsByEntity.get(entity);
    if (!components) {
      this.componentsByEntity.set(entity, [component]);
    } else {
      components.push(component);
    }
  }

  private removeComponentByType(component: Component) {
    const components = this.componentsByType.get(component.type);
    if (components) {
      components.splice(components.indexOf(component), 1);
    }
  }

  private removeComponentByEntity(entity: number, component: Component) {
    (component as ComponentWithEntity).entity = entity;
    const components = this.componentsByEntity.get(entity);
    if (components) {
      components.splice(components.indexOf(component), 1);
    }
  }

  getComponentsByType<T extends Component>(type: string): (T & ComponentWithEntity)[] {
    const components = this.componentsByType.get(type) as (T & ComponentWithEntity)[];
    return components ?? [];
  }

  getComponentsByEntity(entity: Entity): Component[] {
    return this.componentsByEntity.get(entity) ?? [];
  }

  clear() {
    this.componentsByType.clear();
    this.componentsByEntity.clear();
  }

  setGlobal(key: string, value: unknown) {
    this.globals.set(key, value);
  }

  getGlobal<T>(key: string): T | undefined {
    return this.globals.get(key) as T;
  }
}
