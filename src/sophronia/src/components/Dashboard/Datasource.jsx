import { Button } from "../ui/Button";
import { Card } from "./Card";
import { RiSeedlingLine} from "react-icons/ri";

export const DatasourceCard = () => {
  return (
    <div className='ml-2'>
      <Card size='sm'>
        <div className='text-xs italic text-gray-700 dark:text-gray-400'>
          <a href='https://www.bfi.org.uk/industry-data-insights/weekend-box-office-figures'
            target='_blank'
            rel='noopener noreferrer'
          >
            Data Source
          </a>
        </div>
      </Card>
    </div>
  );
};

export const DatasourceButton = () => {
  return (
    <Button>
      <div className='px-1'>
        <RiSeedlingLine />
      </div>
      <a href='https://www.bfi.org.uk/industry-data-insights/weekend-box-office-figures'
        target='_blank'
        rel='noopener noreferrer'
      >
        Data Source
      </a>
    </Button>
  );
}