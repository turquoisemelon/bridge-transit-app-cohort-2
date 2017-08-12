import React from 'react';
import { EventsList } from './EventsList';

export const EventsByCategoryPage = (props) => (
  <div className="events-by-category-page">
    {props.allCategories.map(category => category.id === props.params.categoryID
      ? <h2>{category.name} Events near Toronto, Ontario</h2>
      : null)
    }
    {props.events
      ? <EventsList events={props.events} />
      : null
    }
  </div>
);
