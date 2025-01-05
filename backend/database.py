from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB connection configuration
MONGO_URI = 'mongodb://localhost:27017'

try:
    client = MongoClient(MONGO_URI)
    db = client['KodEstudio']
    logger.info("Successfully connected to MongoDB")
except Exception as e:
    logger.error(f"Error connecting to MongoDB: {str(e)}")
    raise

class DatabaseManager:
    def __init__(self):
        self.collection = db['Solicitudes']  # Usando la colección correcta 'Solicitudes'

    @staticmethod
    def serialize_object_id(item):
        """Convert ObjectId to string in a document"""
        if item.get('_id'):
            item['_id'] = str(item['_id'])
        return item

    @staticmethod
    def validate_requirement_data(data):
        """Validate required fields in requirement data"""
        required_fields = [
            'projectTitle',
            'requestorName',
            'requestorEmail',
            'department',
            'description',
            'requestedEndDate'
        ]
        
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")
        
        return True

    def insert_project_requirement(self, form_data):
        """
        Insert a new project requirement into the database
        """
        try:
            self.validate_requirement_data(form_data)
            
            # Add metadata
            form_data['created_at'] = datetime.utcnow()
            form_data['updated_at'] = datetime.utcnow()
            form_data['status'] = form_data.get('status', 'Pending')
            
            result = self.collection.insert_one(form_data)
            logger.info(f"Successfully inserted requirement with ID: {result.inserted_id}")
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error inserting project requirement: {str(e)}")
            raise

    def get_project_requirement(self, requirement_id):
        """
        Retrieve a specific project requirement by ID
        """
        try:
            requirement = self.collection.find_one({"_id": ObjectId(requirement_id)})
            if requirement:
                return self.serialize_object_id(requirement)
            return None
        except Exception as e:
            logger.error(f"Error retrieving project requirement: {str(e)}")
            raise

    def get_all_project_requirements(self, filters=None, sort_by=None, page=1, per_page=10):
        """
        Retrieve all project requirements with optional filtering and pagination
        """
        try:
            query = filters if filters else {}
            
            # Calculate skip value for pagination
            skip = (page - 1) * per_page
            
            # Set up sort parameters
            sort_params = []
            if sort_by:
                for field, direction in sort_by.items():
                    sort_params.append((field, direction))
            else:
                sort_params = [('created_at', -1)]
            
            # Execute query with pagination
            cursor = self.collection.find(query)
            total = cursor.count()
            
            requirements = list(cursor.sort(sort_params)
                              .skip(skip)
                              .limit(per_page))
            
            # Serialize ObjectIds
            requirements = [self.serialize_object_id(req) for req in requirements]
            
            return {
                'requirements': requirements,
                'total': total,
                'page': page,
                'per_page': per_page,
                'total_pages': -(-total // per_page)
            }
        except Exception as e:
            logger.error(f"Error retrieving project requirements: {str(e)}")
            raise

    def update_project_requirement(self, requirement_id, update_data):
        """
        Update an existing project requirement
        """
        try:
            update_data['updated_at'] = datetime.utcnow()
            
            result = self.collection.update_one(
                {"_id": ObjectId(requirement_id)},
                {"$set": update_data}
            )
            
            if result.matched_count > 0:
                logger.info(f"Successfully updated requirement: {requirement_id}")
                return True
            logger.warning(f"No requirement found with ID: {requirement_id}")
            return False
        except Exception as e:
            logger.error(f"Error updating project requirement: {str(e)}")
            raise

    def delete_project_requirement(self, requirement_id):
        """
        Delete a project requirement
        """
        try:
            result = self.collection.delete_one({"_id": ObjectId(requirement_id)})
            if result.deleted_count > 0:
                logger.info(f"Successfully deleted requirement: {requirement_id}")
                return True
            logger.warning(f"No requirement found with ID: {requirement_id}")
            return False
        except Exception as e:
            logger.error(f"Error deleting project requirement: {str(e)}")
            raise

    def search_requirements(self, search_term):
        """
        Search project requirements by various fields
        """
        try:
            query = {
                "$or": [
                    {"projectTitle": {"$regex": search_term, "$options": "i"}},
                    {"description": {"$regex": search_term, "$options": "i"}},
                    {"requestorName": {"$regex": search_term, "$options": "i"}},
                    {"department": {"$regex": search_term, "$options": "i"}}
                ]
            }
            
            results = list(self.collection.find(query))
            return [self.serialize_object_id(req) for req in results]
        except Exception as e:
            logger.error(f"Error searching requirements: {str(e)}")
            raise

    def get_requirements_stats(self):
        """
        Get statistics about project requirements
        """
        try:
            stats = {
                'total_requirements': self.collection.count_documents({}),
                'status_counts': {},
                'priority_counts': {},
                'department_counts': {},
                'monthly_submissions': []
            }
            
            # Status counts
            status_pipeline = [
                {"$group": {"_id": "$status", "count": {"$sum": 1}}}
            ]
            status_results = list(self.collection.aggregate(status_pipeline))
            stats['status_counts'] = {item['_id']: item['count'] for item in status_results}
            
            # Priority counts
            priority_pipeline = [
                {"$group": {"_id": "$priority", "count": {"$sum": 1}}}
            ]
            priority_results = list(self.collection.aggregate(priority_pipeline))
            stats['priority_counts'] = {item['_id']: item['count'] for item in priority_results}
            
            # Department counts
            department_pipeline = [
                {"$group": {"_id": "$department", "count": {"$sum": 1}}}
            ]
            department_results = list(self.collection.aggregate(department_pipeline))
            stats['department_counts'] = {item['_id']: item['count'] for item in department_results}
            
            return stats
        except Exception as e:
            logger.error(f"Error getting requirements statistics: {str(e)}")
            raise
    
    @staticmethod
    def validate_requirement_data(data):
        """Validate required fields in requirement data"""
        required_fields = [
            'date', 'projectTitle', 'requestorName', 'requestorPhone',
            'requestorEmail', 'department', 'sponsorName', 'sponsorPhone',
            'sponsorEmail', 'description', 'dependencies', 'requestedEndDate',
            'estimatedBudget', 'status', 'priority', 'projectType',
            'technicalRequirements', 'businessJustification', 'riskAssessment'
        ]
        
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")
        
        return True

    def insert_project_requirement(self, form_data):
        """
        Insert a new project requirement into the database
        """
        try:
            self.validate_requirement_data(form_data)
            
            # Add metadata
            form_data['created_at'] = datetime.utcnow()
            form_data['updated_at'] = datetime.utcnow()
            
            result = self.collection.insert_one(form_data)
            logger.info(f"Successfully inserted requirement with ID: {result.inserted_id}")
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error inserting project requirement: {str(e)}")
            raise

    def update_project_requirement(self, requirement_id, update_data):
        """
        Update an existing project requirement
        """
        try:
            self.validate_requirement_data(update_data)
            update_data['updated_at'] = datetime.utcnow()
            
            result = self.collection.update_one(
                {"_id": ObjectId(requirement_id)},
                {"$set": update_data}
            )
            
            if result.matched_count > 0:
                logger.info(f"Successfully updated requirement: {requirement_id}")
                return True
            logger.warning(f"No requirement found with ID: {requirement_id}")
            return False
        except Exception as e:
            logger.error(f"Error updating project requirement: {str(e)}")
            raise