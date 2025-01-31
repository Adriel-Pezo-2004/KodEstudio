from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import logging
from werkzeug.security import generate_password_hash, check_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseManager:
    _instance = None
    
    def __init__(self):
        if not DatabaseManager._instance:
            try:
                self.client = MongoClient('mongodb://localhost:27017')
                self.db = self.client['KodEstudio']
                self.collection = self.db['Solicitudes']
                self.users_collection = self.db['Usuarios']
                self.reviews_collection = self.db['Calificaciones']
                self.clientes_collection = self.db['Clientes']
                DatabaseManager._instance = self
                logger.info("Successfully connected to MongoDB")
            except Exception as e:
                logger.error(f"Error connecting to MongoDB: {str(e)}")
                raise

    def insert_user(self, user_data):
        """Insert a new user into the database"""
        try:
            result = self.users_collection.insert_one(user_data)
            logger.info(f"Successfully inserted user with ID: {result.inserted_id}")
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error inserting user: {str(e)}")
            raise

    def update_user(self, user_id, update_data):
        """Update an existing user"""
        try:
            if '_id' in update_data:
                del update_data['_id']
            
            # La fecha de actualización ya está formateada en el controlador
            result = self.users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            
            if result.matched_count > 0:
                logger.info(f"Successfully updated user: {user_id}")
                return True
            logger.warning(f"No user found with ID: {user_id}")
            return False
        except Exception as e:
            logger.error(f"Error updating user: {str(e)}")
            raise

    def get_all_reviews(self):
        """Retrieve all reviews from the database"""
        try:
            reviews = list(self.reviews_collection.find())
            for review in reviews:
                review['_id'] = str(review['_id'])  # Convert ObjectId to string
            return reviews
        except Exception as e:
            logger.error(f"Error retrieving reviews: {str(e)}")
            raise

    def get_all_clientes(self, filters=None, page=1, per_page=10):
        """Retrieve all clients with optional filtering and pagination"""
        try:
            query = filters if filters else {}
            
            # Log the query for debugging
            logger.info(f"MongoDB query: {query}")
            
            # Get total count for pagination
            total_documents = self.clientes_collection.count_documents(query)
            logger.info(f"Found {total_documents} documents matching query")
            
            # Calculate skip value for pagination
            skip = (page - 1) * per_page
            
            # Execute query with pagination
            cursor = self.clientes_collection.find(query).skip(skip).limit(per_page)
            clientes = [self.serialize_object_id(cliente) for cliente in cursor]
            
            return {
                'clientes': clientes,
                'total': total_documents,
                'page': page,
                'per_page': per_page,
                'total_pages': -(-total_documents // per_page)  # Ceiling division
            }
        except Exception as e:
            logger.error(f"Error retrieving clients: {str(e)}")
            raise

    def delete_cliente(self, cliente_id):
        """Delete a client"""
        try:
            result = self.clientes_collection.delete_one({"_id": ObjectId(cliente_id)})
            if result.deleted_count > 0:
                logger.info(f"Successfully deleted client: {cliente_id}")
                return True
            logger.warning(f"No client found with ID: {cliente_id}")
            return False
        except Exception as e:
            logger.error(f"Error deleting client: {str(e)}")
            raise

    def search_clientes(self, search_term):
        """Search clients by various fields"""
        try:
            query = {
                "$or": [
                    {"nombre": {"$regex": search_term, "$options": "i"}},
                    {"email": {"$regex": search_term, "$options": "i"}},
                    {"ciudad": {"$regex": search_term, "$options": "i"}}
                ]
            }
            
            cursor = self.clientes_collection.find(query)
            clientes = [self.serialize_object_id(cliente) for cliente in cursor]
            return clientes
        except Exception as e:
            logger.error(f"Error searching clients: {str(e)}")
            raise
    
    def insert_cliente(self, cliente_data):
        """Insert a new client into the database"""
        try:
            cliente_data['created_at'] = datetime.utcnow()
            cliente_data['updated_at'] = datetime.utcnow()
            result = self.clientes_collection.insert_one(cliente_data)
            logger.info(f"Successfully inserted client with ID: {result.inserted_id}")
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error inserting client: {str(e)}")
            raise

    def update_cliente(self, cliente_id, update_data):
        """Update an existing client"""
        try:
            # Remove _id from update_data if it exists
            if '_id' in update_data:
                del update_data['_id']
            update_data['updated_at'] = datetime.utcnow()
            
            result = self.clientes_collection.update_one(
                {"_id": ObjectId(cliente_id)},
                {"$set": update_data}
            )
            
            if result.matched_count > 0:
                logger.info(f"Successfully updated client: {cliente_id}")
                
                # Update client information in the project requirements collection
                self.collection.update_many(
                    {"requestorEmail": update_data.get('email')},
                    {"$set": {
                        'requestorName': update_data.get('nombre'),
                        'requestorPhone': update_data.get('celular'),
                        'department': update_data.get('ciudad'),
                        'updated_at': datetime.utcnow()
                    }}
                )
                
                return True
            logger.warning(f"No client found with ID: {cliente_id}")
            return False
        except Exception as e:
            logger.error(f"Error updating client: {str(e)}")
            raise


    def get_cliente(self, cliente_id):
        """Retrieve a specific client by ID"""
        try:
            cliente = self.clientes_collection.find_one({"_id": ObjectId(cliente_id)})
            if cliente:
                return self.serialize_object_id(cliente)
            return None
        except Exception as e:
            logger.error(f"Error retrieving client: {str(e)}")
            raise

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

    @staticmethod
    def validate_update_data(data):
        """Validates update data for project requirements."""
        valid_fields = {
            'date', 'projectTitle', 'requestorName', 'requestorPhone',
            'requestorEmail', 'department', 'sponsorName', 'sponsorPhone',
            'sponsorEmail', 'description', 'dependencies', 'requestedEndDate',
            'estimatedBudget', 'status', 'priority', 'projectType',
            'technicalRequirements', 'businessJustification', 'riskAssessment',
            '_id', 'created_at', 'updated_at'  # Allow these fields for updates
        }

        invalid_fields = [field for field in data.keys() if field not in valid_fields]
        if invalid_fields:
            raise ValueError(f"Invalid fields provided: {', '.join(invalid_fields)}")

    def insert_project_requirement(self, form_data):
        """Insert a new project requirement into the database"""
        try:
            form_data['created_at'] = datetime.utcnow()
            form_data['updated_at'] = datetime.utcnow()
            
            # Insert into project requirements collection
            result = self.collection.insert_one(form_data)
            logger.info(f"Successfully inserted requirement with ID: {result.inserted_id}")
            
            # Insert into clients collection
            client_data = {
                'nombre': form_data.get('requestorName'),
                'email': form_data.get('requestorEmail'),
                'celular': form_data.get('requestorPhone'),
                'ciudad': form_data.get('department'),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            client_result = self.clientes_collection.insert_one(client_data)
            logger.info(f"Successfully inserted client with ID: {client_result.inserted_id}")
            
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error inserting project requirement: {str(e)}")
            raise

    def get_project_requirement(self, requirement_id):
        """Retrieve a specific project requirement by ID"""
        try:
            requirement = self.collection.find_one({"_id": ObjectId(requirement_id)})
            if requirement:
                return self.serialize_object_id(requirement)
            return None
        except Exception as e:
            logger.error(f"Error retrieving project requirement: {str(e)}")
            raise

    def get_all_project_requirements(self, filters=None, sort_by=None, page=1, per_page=10):
        """Retrieve all project requirements with optional filtering and pagination"""
        try:
            query = filters if filters else {}
            
            # Get total count for pagination
            total_documents = self.collection.count_documents(query)
            
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
            cursor = self.collection.find(query).sort(sort_params).skip(skip).limit(per_page)
            requirements = [self.serialize_object_id(req) for req in cursor]
            
            return {
                'requirements': requirements,
                'total': total_documents,
                'page': page,
                'per_page': per_page,
                'total_pages': -(-total_documents // per_page)  # Ceiling division
            }
        except Exception as e:
            logger.error(f"Error retrieving project requirements: {str(e)}")
            raise

    def update_project_requirement(self, requirement_id, update_data):
        """Update an existing project requirement"""
        try:
            # Remove _id from update_data if it exists
            if '_id' in update_data:
                del update_data['_id']
            update_data['updated_at'] = datetime.utcnow()
            
            result = self.collection.update_one(
                {"_id": ObjectId(requirement_id)},
                {"$set": update_data}
            )
            
            if result.matched_count > 0:
                logger.info(f"Successfully updated requirement: {requirement_id}")
                
                # Update client information in the clients collection
                client_data = {
                    'nombre': update_data.get('requestorName'),
                    'email': update_data.get('requestorEmail'),
                    'celular': update_data.get('requestorPhone'),
                    'ciudad': update_data.get('department'),
                    'updated_at': datetime.utcnow()
                }
                self.clientes_collection.update_one(
                    {"email": update_data.get('requestorEmail')},
                    {"$set": client_data}
                )
                
                return True
            logger.warning(f"No requirement found with ID: {requirement_id}")
            return False
        except Exception as e:
            logger.error(f"Error updating project requirement: {str(e)}")
            raise

    def delete_project_requirement(self, requirement_id):
        """Delete a project requirement"""
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
        """Search project requirements by various fields"""
        try:
            query = {
                "$or": [
                    {"projectTitle": {"$regex": search_term, "$options": "i"}},
                    {"description": {"$regex": search_term, "$options": "i"}},
                    {"requestorName": {"$regex": search_term, "$options": "i"}},
                    {"department": {"$regex": search_term, "$options": "i"}}
                ]
            }
            
            cursor = self.collection.find(query)
            requirements = [self.serialize_object_id(req) for req in cursor]
            return requirements
        except Exception as e:
            logger.error(f"Error searching requirements: {str(e)}")
            raise

    def get_requirements_stats(self):
        """Get statistics about project requirements"""
        try:
            stats = {
                'total_requirements': self.collection.count_documents({}),
                'status_counts': {},
                'priority_counts': {},
                'department_counts': {}
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

    def get_user_by_username(self, username):
        """Retrieve a user by username"""
        try:
            user = self.users_collection.find_one({"username": username})
            if user:
                return self.serialize_object_id(user)
            return None
        except Exception as e:
            logger.error(f"Error retrieving user: {str(e)}")
            raise

    def get_user_by_id(self, user_id):
        """Retrieve a user by ID"""
        try:
            user = self.users_collection.find_one({"_id": ObjectId(user_id)})
            if user:
                return self.serialize_object_id(user)
            return None
        except Exception as e:
            logger.error(f"Error retrieving user: {str(e)}")
            raise
    
    
    def verify_password(self, stored_password, provided_password):
        """Verify a stored password against one provided by the user"""
        return stored_password == provided_password