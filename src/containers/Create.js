import React from "react";
import '../App.css';
import '../styles/Create.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CategorySelect from "../components/CategorySelect";
import PriceForm from "../components/PriceForm";
import { Tabs, Tab } from '../components/Tabs';
import WithContext from '../WithContext';
import withNavigate from '../withNavigate';
import { TYPE_OUTCOME, TYPE_INCOME } from '../utility';

const tabsText = [TYPE_INCOME, TYPE_OUTCOME];

class Create extends React.Component {
  constructor(props) {
    super(props);
    
    const { id } = this.props.params;
    const { items, categories } = this.props.data;
    
    // Safely access editItem and categories
    const editItem = id && items[id] ? items[id] : null;
    const selectedTab = editItem && categories[editItem.cid] ? categories[editItem.cid].type : TYPE_OUTCOME;

    this.state = {
      selectedTab,  // Set based on item type if editing
      selectedCategoryId: editItem ? editItem.cid : null,
      categoryError: false,
      editItem,
    };
  }

  componentDidMount() { 
    const { id } = this.props.params;
    this.props.actions.getInitialData();  // Fetch initial data
    if (id) {
      this.props.actions.getEditData(id).then(data => {
        const { editItem, categories } = data;

        // Safely check if editItem and categories[editItem.cid] exist
        const selectedTab = editItem && categories[editItem.cid] ? categories[editItem.cid].type : TYPE_OUTCOME;
        const selectedCategoryId = editItem ? editItem.cid : null;

        this.setState({
          selectedTab,
          selectedCategoryId,
          editItem,
        });
      });
    }
  }

  handleTabChange = (index) => {
    this.setState({ 
      selectedTab: tabsText[index],
      selectedCategoryId: null,  // Reset selected category when switching tabs
      categoryError: false  // Reset error when switching tabs
    });
  }

  handleCategorySelect = (category) => {
    this.setState({ 
      selectedCategoryId: category.id,
      categoryError: false  // Clear error when a category is selected
    });
  }

  cancelSubmit = () => {
    this.props.navigate('/');
  }

  submitForm = (data, isEditMode) => {
    const { selectedCategoryId } = this.state;

    // Validate if a category is selected
    if (!selectedCategoryId) {
      this.setState({ categoryError: true });  // Set error state
      return;  // Stop form submission if no category is selected
    }

    // Submit form if category is selected
    if (!isEditMode) {
      this.props.actions.createItem(data, selectedCategoryId).then(() => {
        this.props.navigate('/');
      });
    } else {
      this.props.actions.updateItem(data, selectedCategoryId).then(() => {
        this.props.navigate('/');
      });
    }
  }

  render() {
    const { data } = this.props;
    const { categories } = data;
    const { selectedTab, selectedCategoryId, categoryError, editItem } = this.state;
    const { id } = this.props.params;

    // Determine the active index for the Tabs component
    const activeIndex = tabsText.findIndex(text => text === selectedTab);

    // Filter categories by income or outcome based on the selected tab
    const filteredCategories = Object.keys(categories)
      .filter(cid => categories[cid]?.type === selectedTab)  // Safely access `categories[cid]`
      .map(cid => categories[cid]);

    // Find the selected category from the categories list using the selectedCategoryId
    const selectedCategory = categories[selectedCategoryId];

    return (
      <div className="create-page container mt-5 py-4 px-3 rounded">
        <h2 className="text-center mb-4">{id ? "Edit Record" : "Create a New Record"}</h2>
        <Tabs activeIndex={activeIndex} onTabChange={this.handleTabChange}>
          <Tab>Income</Tab>
          <Tab>Outcome</Tab>
        </Tabs>

        {/* Pass selectedCategoryId and categories to CategorySelect */}
        <CategorySelect
          categories={filteredCategories}
          onSelectCategory={this.handleCategorySelect}
          selectedCategory={selectedCategory}  // Pass selectedCategory
        />

        {/* Show error message if no category is selected */}
        {categoryError && (
          <div className="alert alert-danger mt-3" role="alert">
            Please select a category before submitting.
          </div>
        )}

        <PriceForm 
          onFormSubmit={this.submitForm} 
          onCancelSubmit={this.cancelSubmit} 
          item={editItem || {}}  // Pass the item to the form, or empty object if creating
        />
      </div>
    );
  }
}

export default withNavigate(WithContext(Create));
