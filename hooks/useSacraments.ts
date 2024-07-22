import { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { updateSacraments } from "@/store/survey";

const GET_SACRAMENTS = gql`
  query GetSacraments {
    getSacraments {
      id
      name
    }
  }
`;

export const useSacraments = () => {
  const { loading, error, data } = useQuery(GET_SACRAMENTS);

  useEffect(() => {
    if (data?.getSacraments) {
      updateSacraments(data.getSacraments);
    }
  }, [data]);

  const getSacramentNameById = (id: string): string => {
    const sacrament = data?.getSacraments.find((s: any) => s.id === id);
    return sacrament ? sacrament.name : id;
  };

  return { loading, error, sacraments: data?.getSacraments, getSacramentNameById };
};
