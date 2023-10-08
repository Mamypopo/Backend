export interface InformationModel {
  id: number,
  name: string,
  picture?: string,
  text: string,
  createdBy?: string,
  updatedBy?: string,
  createdAt?: string,
  updatedAt?: string
}

export type NewInformationModel = Omit<InformationModel, 'id'>;
