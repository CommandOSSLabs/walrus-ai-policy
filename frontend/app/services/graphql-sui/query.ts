/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from "graphql-request";

const metadataSuins = gql`
  query SuiMetadataSuins($address: SuiAddress!) {
    object(address: $address) {
      asMoveObject {
        contents {
          display {
            output
          }
        }
      }
    }
  }
`;
