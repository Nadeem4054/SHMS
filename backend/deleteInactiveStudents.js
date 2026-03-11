const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const StudentApplication = require('./models/StudentApplication');

const deleteInactiveStudents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    console.log('');

    // Find all students (users with role 'student')
    const allStudents = await User.find({ role: 'student' });
    console.log(`Total students found: ${allStudents.length}`);
    console.log('');

    const studentsToDelete = [];
    const studentsWithApplications = [];

    // Check each student for application
    for (const student of allStudents) {
      const application = await StudentApplication.findOne({ 
        email: student.email 
      });

      if (application) {
        studentsWithApplications.push({
          name: student.name,
          email: student.email,
          status: application.status
        });
      } else {
        studentsToDelete.push({
          _id: student._id,
          name: student.name,
          email: student.email,
          createdAt: student.createdAt
        });
      }
    }

    // Show students with applications
    console.log('✅ Students WITH applications (will be kept):');
    console.log('-------------------------------------------');
    if (studentsWithApplications.length === 0) {
      console.log('None found');
    } else {
      studentsWithApplications.forEach((s, i) => {
        console.log(`${i + 1}. ${s.name} (${s.email}) - Status: ${s.status}`);
      });
    }
    console.log(`Total: ${studentsWithApplications.length}`);
    console.log('');

    // Show students to delete
    console.log('❌ Students WITHOUT applications (will be deleted):');
    console.log('----------------------------------------------------');
    if (studentsToDelete.length === 0) {
      console.log('None found - no students to delete!');
    } else {
      studentsToDelete.forEach((s, i) => {
        console.log(`${i + 1}. ${s.name} (${s.email})`);
        console.log(`   Created: ${s.createdAt?.toLocaleDateString() || 'Unknown'}`);
      });
    }
    console.log(`Total: ${studentsToDelete.length}`);
    console.log('');

    // Delete students without applications
    let deletedCount = 0;
    if (studentsToDelete.length > 0) {
      const deleteIds = studentsToDelete.map(s => s._id);
      const result = await User.deleteMany({ _id: { $in: deleteIds } });
      deletedCount = result.deletedCount;
      
      console.log('🗑️  Deletion Result:');
      console.log('-------------------');
      console.log(`✅ Successfully deleted ${deletedCount} student(s)`);
    } else {
      console.log('ℹ️  No students to delete');
    }

    console.log('');
    console.log('📊 Summary:');
    console.log('-----------');
    console.log(`Total students checked: ${allStudents.length}`);
    console.log(`Students with applications: ${studentsWithApplications.length}`);
    console.log(`Students deleted: ${deletedCount}`);
    console.log(`Remaining students: ${allStudents.length - deletedCount}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('');
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

deleteInactiveStudents();
