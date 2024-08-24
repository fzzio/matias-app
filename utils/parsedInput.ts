import { Catechumen, CatechumenUpdateInput } from '@/types/index';

export const parseCatechumenToUpdateInput = (catechumen: Catechumen): CatechumenUpdateInput => {
  return {
    id: catechumen.id,
    idCard: catechumen.idCard,
    name: catechumen.name,
    lastName: catechumen.lastName,
    birthDate: catechumen.birthDate ? catechumen.birthDate : undefined,
    email: catechumen.email,
    phone: catechumen.phone,
    sacraments: catechumen.sacraments.map(sacrament => sacrament.id),
    location: catechumen.location.id,
    address: catechumen.address,
  };
};
